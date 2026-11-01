const axios = require('axios');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const videoUrl = req.query.url;

    if (!videoUrl) {
        return res.status(400).json({ error: 'URL do YouTube ausente.' });
    }

    try {
        const apiResponse = await axios.get(`https://api.cobalt.tools/api/json`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: {
                url: videoUrl,
                vCodec: 'h264',
                vQuality: '720',
                isAudioOnly: false
            }
        });

        const downloadLink = apiResponse.data.url || apiResponse.data.picker[0].url;

        if (!downloadLink) {
            throw new Error('Não foi possível obter o link de download.');
        }

        res.redirect(302, downloadLink);

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: 'Erro ao processar o vídeo com a API externa.' });
    }
};
