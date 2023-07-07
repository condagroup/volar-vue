import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate';
import axios from 'axios';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    selectedConversation: [],
    chatHistory: [],
    messages: [],
    activeConversationId: '',
    tokensUsed: 0,
    chargeDue: 0,
    tokenLimit: 100000,
    tokenNumbersLoading: true,
    loadingConversations: false,
  },
  actions: {
    async fetchConversations({ commit, state }) {
      state.loadingConversations = true;
      try {
        const response = await axios.get(`/api/getConversations/${state.user._id}`);
        console.log('fetchConversations response:');
        console.log(response.data);
    
        if (response.data) {
          commit('setChatHistory', response.data.chatHistory);
        } else {
          commit('setChatHistory', []); // Set chatHistory to an empty array if no conversations are returned
        }
        state.loadingConversations = false;
      } catch (error) {
        console.error(error);
      }
    },
    async fetchConversation({ commit }, conversationId) {
      try {
        const response = await axios.get(`/api/getConversation/${conversationId}`);

        console.log('fetchConversation response: ', response.data);
  
        commit('setSelectedConversation', response.data.conversation.chatHistory);
      } catch (error) {
        console.error(error);
      }
    },
    async startNewConversation({ commit, state }) {
      try {
        const response = await axios.post('/api/startNewConversation', {
          userId: state.user._id,
        });

        commit('addNewConversation', response.data.conversationId);
        commit('setSelectedConversation', []);
        console.log('new conversation id:' + response.data.message);
      } catch (error) {
        console.error(error);
      }
    },
    async updateConversation({ state }, conversationId) {
      try {
        await axios.put(`/api/updateConversation/${conversationId}`, {
          chatHistory: state.selectedConversation,
        });
        console.log('Conversation updated with');
        console.log(state.selectedConversation);
      } catch (error) {
        console.error(error);
      }
    },
    async fetchTokensInfo({ commit }, userEmail) {
      try {
        const response = await axios.get('/api/get-tokens-info', {
          params: {
            email: userEmail
          },
        });
  
        if (response.data.success) {
          const tokensData = {
            tokensUsed: response.data.tokensUsed,
            chargeDue: parseFloat(response.data.chargeDue.toFixed(4)),
            tokenLimit: response.data.maxTokens,
          };
          commit('setTokensInfo', tokensData);
          commit('setLoading', false);
        } else {
          console.error('Error fetching tokens info');
        }
      } catch (error) {
        console.error('Error fetching tokens info:', error);
      }
    },
    async deleteConversation({ commit, state }, conversationId) {
      try {
        await axios.delete(`/api/deleteConversation/${conversationId}`);
        commit('removeConversation', conversationId);
      } catch (error) {
        console.error(error);
      }
    },
    async saveSummaryPrompt({ state, commit }, prompt) {
      try {
        const response = await axios.put(`/api/saveSummaryPrompt/${state.user._id}`, prompt);
        console.log('Prompt saved:', response.data);
  
        // Update user data in the Vuex store
        if (response.data.success && response.data.user) {
          commit('setUser', response.data.user);
        }
      } catch (error) {
        console.error(error);
      }
    },
    // Save Blog Post prompt
    async saveBlogPostPrompt({ state, commit }, prompt) {
      try {
        const response = await axios.put(`/api/saveBlogPostPrompt/${state.user._id}`, prompt);
        console.log('Prompt saved:', response.data);
  
        // Update user data in the Vuex store
        if (response.data.success && response.data.user) {
          commit('setUser', response.data.user);
        }
      } catch (error) {
        console.error(error);
      }
    }
  },
  mutations: {
    addMessage(state, message) {
      const newMessage = {
        message: message.message,
        time: new Date(),
        metadata: {
          sender: message.metadata.sender,
        }
      };
  
      if (state.selectedConversation.length > 0) {
        state.selectedConversation.push(newMessage);
      } else {
        state.messages.push(newMessage);
      }
  
      // Update the selectedConversation state after adding the new message
      state.selectedConversation = state.selectedConversation.length > 0 ? state.selectedConversation : state.messages;
    },
    setUser(state, user) {
      state.user = user;
      state.tokensUsed = user.tokensUsed;
      state.tokenLimit = user.maxTokens;
  },
      clearUser(state) {
        state.user = null;
      },
      setActiveConversation(state, conversationId) {
        state.activeConversationId = conversationId;
    },
      clearContext(state) {
        state.messages = [];
      },
      setChatHistory(state, chatHistory) {
        state.chatHistory = chatHistory;
      },
      addNewConversation(state, conversationId) {
        state.activeConversationId = conversationId;
        state.chatHistory.push({
          conversationId,
          timestamp: new Date().toISOString(),
        });
      },
      setSelectedConversation(state, chatHistory) {
        state.selectedConversation = chatHistory;
      },
      setTokensInfo(state, tokensData) {
        state.tokensUsed = tokensData.tokensUsed;
        state.chargeDue = tokensData.chargeDue;
        state.tokenLimit = tokensData.tokenLimit;
      },
      setLoading(state, tokenNumbersLoading) {
        state.tokenNumbersLoading = tokenNumbersLoading;
      },
      removeConversation(state, conversationId) {
        const index = state.chatHistory.findIndex(chat => chat.conversationId === conversationId);
        if (index > -1) {
            state.chatHistory.splice(index, 1);
        }
    },
  },
  getters: {
    displayedMessages(state) {
      return state.selectedConversation.length > 0 ? state.selectedConversation : state.messages;
    },
},
  plugins: [createPersistedState()],
},
)
