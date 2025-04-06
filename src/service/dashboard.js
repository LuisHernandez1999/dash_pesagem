import api from "../pages/api/api";


export const quantidade_de_pesagens = async () => {
    const response = await api.get('/quantidade-pesagens/');
    return response.data;
};

export const quantidade_de_toneladas_pesadas = async () => {
    const response = await api.get('/quantidade-toneladas/');
    return response.data;
};

export const exibir_pesagem_por_mes = async () => {
    const response = await api.get('/exibir-pesagem-mes/');
    return response.data;
};

export const meta_batida = async () => {
    const response = await api.get('/meta-batida/');
    return response.data;
};

export const def_pesagens_seletiva = async () => {
    const response = await api.get('/total-pesagem-seletiva/');
    return response.data;
};

export const def_pesagens_cata_treco = async () => {
    const response = await api.get('/total-pesagem-cata-treco/');
    return response.data;
};

export const def_pesagens_ao_longo_ano_por_tipo_pesagem = async () => {
    const response = await api.get('/pesagens-por-tipo-ano/');
    return response.data;
};

export const top_5_coperativas_por_pesagem = async () => {
    const response = await api.get('/ranking-cooperativas/');
    return response.data;
};

export const veiculo_maior_pesagens = async () => {
    const response = await api.get('/ranking-veiculos/');
    return response.data;
};

export const eficiencia_motoristas = async () => {
    const response = await api.get('/ranking-motoristas/');
    return response.data;
};