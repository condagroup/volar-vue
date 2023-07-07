const express = require('express');
const applyMiddleware = require('./middleware')
const baseRoutes = require('./routes/baseRoutes')
const conversationRoutes = require('./routes/conversationRoutes')
const stripeRoutes = require('./routes/stripeRoutes')
const userRoutes = require('./routes/userRoutes')
const transcriptionRoutes = require('./routes/transcriptionRoutes')
const clinikoRoutes = require('./routes/clinikoRoutes')
const {stripeWebhook} = require('./stripeWebhook');

app = express();

app.post('/stripe-webhook', express.raw({type: 'application/json'}), stripeWebhook);

applyMiddleware(app, express)

app.use(baseRoutes)
app.use(userRoutes)
app.use(conversationRoutes)
app.use(stripeRoutes)
app.use(transcriptionRoutes)
app.use(clinikoRoutes)

const port = process.env.PORT || 80;
console.log(port)
app.listen(port);