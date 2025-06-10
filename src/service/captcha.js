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


export async function verifyCaptchaService({ captchaId, userInput, phoneNumber }) {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/captcha/verify_captcha/`, {
      captcha_id: captchaId,
      user_input: userInput,
      phone_number: phoneNumber,
    });

    const data = response.data;

    return {
      success: true,
      message: data.message || 'Verificação bem-sucedida.',
      status: response.status,
    };
  } catch (error) {
    // Se for erro da API com resposta
    if (error.response) {
      const data = error.response.data;
      return {
        success: false,
        error: data.error || 'Erro ao verificar o CAPTCHA.',
        status: error.response.status,
      };
    }

    // Se for erro de rede ou inesperado
    return {
      success: false,
      error: 'Erro ao conectar com o servidor.',
      details: error.message,
      status: null,
    };
  }
}


