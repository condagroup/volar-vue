const express = require("express");
const multer = require("multer");
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({ apiKey: process.env.OPEN_AI_API_KEY });
const openai = new OpenAIApi(configuration);
const fs = require("fs");
const path = require("path");
const os = require("os");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffprobePath = require('@ffprobe-installer/ffprobe').path;
const { v4: uuidv4 } = require("uuid");

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

const upload = multer({
  storage: multer.diskStorage({
    destination: os.tmpdir(),
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  }),
  limits: { fileSize: 150 * 1024 * 1024 }, // 150 MB
});

const router = express.Router();
const ongoingTasks = {};

// router.post("/api/transcribe", upload.single("file"), async (req, res) => {
//   try {
//     const file = req.file;
//     const chunkIndex = parseInt(req.body.chunkIndex, 10);
//     const totalChunks = parseInt(req.body.totalChunks, 10);
//     const fileName = req.body.fileName;

//     const fileDir = path.join(os.tmpdir(), fileName);
//     if (!fs.existsSync(fileDir)) {
//       fs.mkdirSync(fileDir);
//     }

//     const chunkPath = path.join(fileDir, `${chunkIndex}`);
//     fs.writeFileSync(chunkPath, fs.readFileSync(file.path));
//     fs.unlinkSync(file.path);

//     if (chunkIndex === totalChunks - 1) {
//       // Move the file merging and processing to a separate function
//       const taskId = await mergeAndProcessChunks(fileDir, totalChunks, fileName);

//       // Send the task ID to the client
//       res.json({ status: "Processing started", taskId });
//     }
//   } catch (error) {
//     console.error("Error handling file upload:", error);
//     res.status(500).send("Error handling file upload.");
//   }
// });

// async function mergeAndProcessChunks(fileDir, totalChunks, fileName) {
//   try {
//     const filePath = path.join(os.tmpdir(), Date.now() + path.extname(fileName));
//     console.log("Merging chunks into file:", filePath);

//     // Merge the chunks
//     const writeStream = fs.createWriteStream(filePath);
//     for (let i = 0; i < totalChunks; i++) {
//       const chunk = fs.readFileSync(path.join(fileDir, `${i}`));
//       writeStream.write(chunk);
//       fs.unlinkSync(path.join(fileDir, `${i}`));
//     }
//     writeStream.end();
//     const convertedFilePath = await convertToMp3(filePath);

//     // Process the merged file
//     const taskId = uuidv4();
//     ongoingTasks[taskId] = { status: "processing", timestamp: Date.now() };

//     processFile(convertedFilePath, taskId).catch((error) => {
//       console.error("Error processing file:", error);
//       ongoingTasks[taskId] = { status: "error", timestamp: Date.now() };
//     });

//     // Delete the file directory
//     fs.rmdirSync(fileDir);
//   } catch (error) {
//     console.error("Error merging and processing chunks:", error);
//     // Handle error, e.g., send an error message to the user
//   }
// }

router.post("/api/transcribe", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    const filePath = file.path;

    // Convert the file to mp3 format if it's an m4a file
    const convertedFilePath = await convertToMp3(filePath);
    console.log("Converted file path:", convertedFilePath);

    // Create a unique task ID
    const taskId = uuidv4();
    ongoingTasks[taskId] = { status: "processing", timestamp: Date.now() };

    // Process the file in the background
    processFile(convertedFilePath, taskId).catch((error) => {
      console.error("Error processing file:", error);
      ongoingTasks[taskId] = { status: "error", timestamp: Date.now() };
    });

    // Return the task ID to the client
    res.json({ taskId });
  } catch (error) {
    console.error("Error handling file upload:", error);
    if (error.message && error.message.includes("Request failed with status code 503")) {
      res.status(503).send("Transcription service is currently unavailable. Please try again later.");
    } else {
      res.status(500).send("Error handling file upload.");
    }
  }
});

router.get("/api/transcribe/status/:taskId", async (req, res) => {
  const taskId = req.params.taskId;
  const task = ongoingTasks[taskId];

  if (task) {
    res.json(task);
  } else {
    res.status(404).send("Task not found.");
  }
});

async function processFile(filePath, taskId) {
  try {
    const fileSize = fs.statSync(filePath).size;
    const fileSizeInMB = fileSize / (1024 * 1024);
    console.log("File size:", fileSizeInMB, "MB");
    let result;

    if (fileSizeInMB > 20) {
      result = await processAudioChunks(filePath);
    } else {
      const resp = await openai.createTranscription(
        fs.createReadStream(filePath),
        "whisper-1"
      );
      result = resp.data;
    }

    // Save the result and update the task status
    ongoingTasks[taskId] = { status: "completed", result, timestamp: Date.now() };

    // Delete the original audio file
    fs.unlink(filePath, (err) => {
      if (err) console.error("Error deleting temporary file:", err);
    });
  } catch (error) {
    console.error("Error processing file:", error);
    ongoingTasks[taskId] = { status: "error", timestamp: Date.now() };
    throw error;
  }
}

async function processAudioChunks(filePath) {
  try {
    console.log("Processing audio chunks");
    const chunkDuration = 60 * 20; // 20 minutes in seconds
    const overlapDuration = 10; // 10 seconds
    let chunkIndex = 0;
    let transcriptionResults = [];

    const duration = await getAudioDurationInSeconds(filePath);

    while (chunkIndex * chunkDuration < duration) {

      const start = chunkIndex * chunkDuration;
      // chunkOutputPath with file format of file (mp3, wav, etc.) 
      const chunkOutputPath = path.join(os.tmpdir(), `${chunkIndex}.${path.extname(filePath)}`);
      console.log("Chunk output path:", chunkOutputPath);

      // Trim the audio chunk
      await new Promise((resolve, reject) => {
        ffmpeg(filePath)
          .setStartTime(start)
          .setDuration(chunkDuration + overlapDuration)
          .output(chunkOutputPath)
          .on("end", resolve)
          .on("error", reject)
          .run();
      });

      // Transcribe the audio chunk
      const resp = await openai.createTranscription(
        fs.createReadStream(chunkOutputPath),
        "whisper-1"
      );

      // Store the transcription result
      transcriptionResults.push(resp.data.text);
      // Log first 50 characters of transcription
      console.log("Transcription:", resp.data.text.substring(0, 50));

      // Delete temporary chunk file
      fs.unlink(chunkOutputPath, (err) => {
        if (err) console.error("Error deleting temporary chunk file:", err);
      });

      chunkIndex++;
    }

    // Combine transcriptions
    const combinedTranscription = transcriptionResults.join(" ");
    return { text: combinedTranscription }; // Return object with text key
  } catch (error) {
    console.error("Error processing audio chunks:", error);
    throw error;
  }
}

function cleanupTasks(olderThanSeconds) {
  const currentTime = Date.now();
  for (const taskId in ongoingTasks) {
    const task = ongoingTasks[taskId];
    if (task.timestamp && currentTime - task.timestamp > olderThanSeconds * 1000) {
      delete ongoingTasks[taskId];
    }
  }
}

function getAudioDurationInSeconds(filePath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) reject(err);
      else resolve(metadata.format.duration);
    });
  });
}

async function convertToMp3(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const supportedAudioExtensions = [".m4a", ".wav", ".ogg", ".flac", ".aac", ".wma"];
  const supportedVideoExtensions = [".mp4", ".avi", ".mov", ".mkv", ".flv", ".webm"];
  const supportedExtensions = [...supportedAudioExtensions, ...supportedVideoExtensions];

  if (supportedExtensions.includes(ext)) {
    const mp3FilePath = path.join(os.tmpdir(), `${path.basename(filePath, ext)}.mp3`);

    const ffmpegCommand = ffmpeg(filePath);

    // If the file is a video, extract the audio only
    if (supportedVideoExtensions.includes(ext)) {
      ffmpegCommand.noVideo();
    }

    await new Promise((resolve, reject) => {
      ffmpegCommand
        .output(mp3FilePath)
        .on("end", resolve)
        .on("error", reject)
        .run();
    });

    // Delete the original file
    fs.unlink(filePath, (err) => {
      if (err) console.error(`Error deleting temporary ${ext} file:`, err);
    });

    return mp3FilePath;
  }
  return filePath;
}

// Call the cleanup function every hour
setInterval(() => cleanupTasks(3600), 3600 * 1000);

module.exports = router;