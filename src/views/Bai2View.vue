<template>
    <v-container class="w-50">
        <v-list dense class="ChatContent">
            <v-list-item
                v-for="(message, index) in messages"
                :key="index"
                :class="{'user-message': message.sender === 'Bạn', 'ai-message': message.sender === 'AI'}"
            >
                <div class="content">
                    <v-card>
                        <!-- <strong>{{ message.sender }}:</strong> -->
                        {{ message.text }}
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
    </v-container>
  </template>
  
  <script>
  import Groq from "groq-sdk";
  
  export default {
    data() {
      return {
        messages: [],
        newMessage: "",
        loading: false,
        groq: new Groq({
          apiKey: "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", // Đọc từ biến môi trường
          dangerouslyAllowBrowser: true,
        }),
      };
    },
    methods: {
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
  .v-card {
    width: fit-content;
    max-width: 80%;
    margin: 10px;
    padding: 10px;
    word-wrap: break-word;
    border-radius: 25px;
    }
  .user-message .content{
    display: flex;
    justify-content: flex-end;
  }
  </style>
  