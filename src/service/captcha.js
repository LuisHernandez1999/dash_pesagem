// services/captchaService.js

import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

export async function getCaptcha() {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/captcha/get_captcha/`);

    // Com axios, os dados já vêm em response.data
    const data = response.data;

    // Validação básica do conteúdo
    if (!data.captcha_id || !data.image_base64 || !data.captcha_text) {
      throw new Error("Resposta inválida da API de captcha");
    }

    return {
      captchaId: data.captcha_id,
      imageBase64: data.image_base64,
      captchaText: data.captcha_text, // ⚠️ Exibir apenas em DEV!
    };
  } catch (error) {
    console.error("Erro ao obter captcha:", error);
    throw error;
  }
}
