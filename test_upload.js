const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

async function testUpload() {
    const form = new FormData();
    form.append('name', 'Test CLI Product');
    form.append('description', 'Uploaded via node script');
    form.append('price', '99.99');

    try {
        const res = await axios.post('http://localhost:5000/api/products', form, {
            headers: form.getHeaders(),
        });
        console.log('Success:', res.data);
    } catch (err) {
        console.error('Error:', err.response ? err.response.data : err.message);
    }
}

testUpload();
