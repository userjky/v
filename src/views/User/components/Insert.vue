<script setup>
import { ref } from "vue";
import { insertProductData } from "@/apis/detection.js";

const user = JSON.parse(localStorage.getItem("user") || '{}');

const frontImageFile = ref(null);
const backImageFile = ref(null);
const frontImagePreview = ref('');
const backImagePreview = ref('');
const loading = ref(false);
const message = ref('');
const showMessage = ref(false);
const icon = ref('');

const handleFrontChange = (e) => {
  const file = e.target.files[0];
  frontImageFile.value = file;
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      frontImagePreview.value = event.target.result;
    };
    reader.readAsDataURL(file);
  } else {
    frontImagePreview.value = '';
  }
};

const handleBackChange = (e) => {
  const file = e.target.files[0];
  backImageFile.value = file;
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      backImagePreview.value = event.target.result;
    };
    reader.readAsDataURL(file);
  } else {
    backImagePreview.value = '';
  }
};

const insert = async () => {
  if (!frontImageFile.value || !backImageFile.value) {
    alert("请上传正面和反面图片");
    return;
  }

  const formData = new FormData();
  formData.append("userId", user.id);
  formData.append("frontImage", frontImageFile.value);
  formData.append("backImage", backImageFile.value);

  loading.value = true;
  showMessage.value = true;
  icon.value = '⌛';
  message.value = '上传中...';

  try {
    await insertProductData(formData);
    icon.value = '✅';
    message.value = '图片上传成功';
    frontImageFile.value = null;
    backImageFile.value = null;
    frontImagePreview.value = '';
    backImagePreview.value = '';
  } catch (err) {
    icon.value = '❌';
    message.value = '上传失败';
    console.error(err);
  } finally {
    loading.value = false;
    setTimeout(() => {
      showMessage.value = false;
      message.value = '';
      icon.value = '';
    }, 30000);
  }
};
</script>
<template>
  <div class="rightMain">
    <div class="insertContainer">
      <div v-if="showMessage" class="overlay">
        <div class="dialog">
          <span class="icon">{{ icon }}</span>
          <span class="text">{{ message }}</span>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>操作员</th>
            <th>{{ user.id }}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>正面图片</td>
            <td>
              <div class="image-upload">
                <input type="file" accept="image/*" @change="handleFrontChange" />
                <div v-if="frontImagePreview" class="preview">
                  <img :src="frontImagePreview" alt="正面预览" />
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td>反面图片</td>
            <td>
              <div class="image-upload">
                <input type="file" accept="image/*" @change="handleBackChange" />
                <div v-if="backImagePreview" class="preview">
                  <img :src="backImagePreview" alt="反面预览" />
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="btnWrapper">
        <button @click="insert">上传</button>
      </div>
    </div>
  </div>
</template>



<style scoped>
.rightMain {
  flex: 1;        
   padding: 20px 50px 20px 350px;
  box-sizing: border-box;
  overflow-y: auto;
}
.insertContainer {
  width: 100%;          
  height: 100%;         
  padding: 20px 0 0 0;  
  box-sizing: border-box;
  overflow-y: auto;     
}
table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

th, td {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: center;
}

input[type="number"] {
  width: 80px;
}

.image-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

input[type="file"] {
  width: 90%;
}

.preview img {
  max-width: 200px;
  max-height: 150px;
  border: 1px solid #ccc;
  border-radius: 5px;
  object-fit: contain;
}

.btnWrapper {
  margin-top: 20px;
  text-align: center;
}

button {
  padding: 10px 25px;
  font-size: 16px;
  background-color: royalblue;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #1a4dbb;
}
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}
.dialog {
  background: white;
  padding: 20px 30px;
  border-radius: 8px;
  font-size: 18px;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 10px;
}
.icon {
  font-size: 24px;
}
.text {
  font-weight: bold;
}

</style>
