import axios from 'axios';
import { Configuration, OpenAIApi } from 'openai';

export async function getApiKey() {
    try {
        const response = await axios.get('/api-key');
        return response.data;
    } catch (error) {
        console.error('Error fetching API key:', error);
        throw error;
    }
}

export function createOpenAIApi(apiKey) {
    const config = new Configuration({ apiKey });
    return new OpenAIApi(config);
}

export async function getAndStoreUserDetails(email, store) {
    try {
      const response = await axios.get('/api/get-user-details', { params: { email } });
      store.commit('setUser', response.data.userDetails);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  }

export async function updateTokensUsed (email, tokensUsed) {
    try {
        const response = await axios.post('/api/update-tokens-used', {
            email,
            tokensUsed,
        });

        if (response.data.success) {
            console.log('Tokens used updated successfully');
        } else {
            console.error('Error updating tokens used');
        }
    } catch (error) {
        console.error('Error updating tokens used:', error);
    }
}

export async function sendUsageReport (customerId, subscriptionItemId, tokensUsed) {
    try {
        const response = await axios.post('/api/report-usage', {
            customerId,
            subscriptionItemId,
            tokensUsed,
        });

        const result = response.data;

        if (result.success) {
            console.log('Usage reported successfully:', result.usageRecord);
        } else {
            console.error('Error reporting usage:', result.error);
        }
    } catch (error) {
        console.error('Error sending usage report:', error.message);
    }
}

export async function dontShowTokenModalAgain (store) {
    try {
        await axios.put(`/api/update-user/${store.state.user._id}`, {
            showTokenModal: false,
        });
        store.state.user.showTokenModal = false;
    } catch (error) {
        console.error("Error updating user's showTokenModal property:", error);
    }
}

export async function sendApiStreamingRequest(apiKey, model, messages, temperature = 0.7) {
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model,
          messages,
          stream: true,
          temperature,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }