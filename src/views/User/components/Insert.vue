<script setup>
import { ref } from "vue";

const user = JSON.parse(localStorage.getItem("user") || '{}');

const frontImageFile = ref(null);
const backImageFile = ref(null);
const frontImagePreview = ref('');
const backImagePreview = ref('');

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

  try {
    const res = await fetch("/detection/insert-image", {
      method: "POST",
      headers: {
        Authorization: user.token || ''
      },
      body: formData
    });

    if (res.ok) {
      alert("图片上传成功");
      frontImageFile.value = null;
      backImageFile.value = null;
      frontImagePreview.value = '';
      backImagePreview.value = '';
    } else {
      alert("上传失败");
    }
  } catch (err) {
    alert("请求异常");
    console.error(err);
  }
};
</script>

<template>
  <div class="insertContainer">
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
</template>


<style scoped>
.insertContainer {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;
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
</style>
