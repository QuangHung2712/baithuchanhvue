<template>
  <div class="header">
    <v-row>
      <v-col cols="4" class="d-flex">
        <v-btn class="m3" icon="mdi-menu" variant="text"></v-btn>
        <v-btn prepend-icon="mdi-plus" variant="text" @click="newChat">NEW CHAT</v-btn>
        <v-checkbox label="Show Think" hide-details class="m3"></v-checkbox>
      </v-col>
      <v-col cols="8">
        <h2>AI BOT</h2>
      </v-col>
    </v-row>
  </div>
  <v-row class="body">
    <v-col cols="2">
      <v-list dense>
        <v-list-item v-for="(chat, index) in chatHistory" :key="index" @click="selectChat(index)">
          <v-list-item-content>
            <v-list-item-title>Chat {{ index + 1 }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-col>
    <v-col cols="10">
      <v-list dense class="ChatContent">
        <v-list-item
          v-for="(message, index) in messages"
          :key="index"
          :class="{'user-message': message.sender === 'Bạn', 'ai-message': message.sender === 'AI'}"
        >
          <div class="content">
            <v-card>
              <!-- <strong>{{ message.sender }}:</strong> -->
              <vue-markdown-it class="text-left" :source="message.text" />
            </v-card>
          </div>
        </v-list-item>
      </v-list>
      <div class="d-flex">
        <v-text-field
          v-model="newMessage"
          placeholder="Hỏi bất cứ thứ gì"
          variant="outlined"
          dense
          hide-details
          class="flex-grow-1"
          @keyup.enter="sendMessage"
          :disabled="loading"
        ></v-text-field>
        <v-btn icon="mdi-send" @click="sendMessage" :loading="loading" variant="text" ></v-btn>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import Groq from "groq-sdk";
import VueMarkdownIt from "vue3-markdown-it";
import "highlight.js/styles/github-dark.css";

export default {
  components: {
    VueMarkdownIt,
  },
  data() {
    return {
      messages: [],
      newMessage: "",
      loading: false,
      chatHistory: [], // Lưu trữ các đoạn chat cũ
      currentChatIndex: null,
      groq: new Groq({
        apiKey: "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", // Đọc từ biến môi trường
        dangerouslyAllowBrowser: true,
      }),
    };
  },
  methods: {
    newChat() {
      if (this.messages.length > 0) {
        if (this.currentChatIndex !== null) {
          // Nếu đang ở một đoạn chat cũ, cập nhật nó
          this.chatHistory[this.currentChatIndex] = [...this.messages];
        } else {
          // Nếu đang ở đoạn chat mới, lưu vào danh sách
          this.chatHistory.push([...this.messages]);
        }
      }
      this.messages = []; // Reset tin nhắn mới
      this.currentChatIndex = this.chatHistory.length; // Chuyển sang chat mới
    },

    // Khi chọn lại một đoạn chat cũ
    selectChat(index) {
      // Trước khi chuyển, lưu đoạn chat hiện tại
      if (this.currentChatIndex !== null) {
        this.chatHistory[this.currentChatIndex] = [...this.messages];
      }
      
      this.messages = [...this.chatHistory[index]];
      this.currentChatIndex = index;
    },
    async sendMessage() {
      if (!this.newMessage.trim() || this.loading) return;

      this.messages.push({ sender: "Bạn", text: this.newMessage });
      this.loading = true;

      try {
        const response = await this.groq.chat.completions.create({
          messages: [{ role: "user", content: this.newMessage }],
          model: "llama-3.3-70b-versatile",
        });

        const aiResponse =
          response.choices[0]?.message?.content || "Không có phản hồi.";
        this.messages.push({ sender: "AI", text: aiResponse });
        if (this.currentChatIndex !== null) {
          this.chatHistory[this.currentChatIndex] = [...this.messages];
        }
        console.log(this.chatHistory)
      } catch (error) {
        console.error("Lỗi khi gọi API Groq AI:", error);
        this.messages.push({ sender: "AI", text: "Xin lỗi, có lỗi xảy ra." });
      } finally {
        this.loading = false;
        this.newMessage = "";
      }
    },
  },
};
</script>

<style scoped>
.message-item {
  padding: 8px 0;
}
.ChatContent{
  height: 80vh;
  overflow-y: auto;
  padding-bottom: 10px;
}
.header{
  background-color: #1976D2;
  color: white;
  height: 60px;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  z-index: 10
}
.m3{
  margin-top: -7px;
}
.message-item {
  margin: 8px 0;
}
.ai-message {
  justify-content: flex-start !important; /* Tin nhắn AI căn trái */
  text-align: left;
}

.v-card {
  width: fit-content;
  max-width: 80%;
  padding: 10px;
  word-wrap: break-word;
  border-radius: 25px;
}

.user-message .v-card {
  background-color: #1976D2;
  color: white;
}

.ai-message .v-card {
  background-color: #E3F2FD;
  color: black;
}
.user-message .content{
 display: flex;
 justify-content: flex-end;
}
.input-bar {
  display: flex;
  gap: 8px;
  padding: 10px;
  background: white;
  border-top: 1px solid #ddd;
  position: sticky;
  bottom: 0;
  z-index: 10;
}
.body{
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}
</style>
