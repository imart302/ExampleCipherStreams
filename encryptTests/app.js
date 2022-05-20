const { scrypt, randomFill, Cipher, createCipheriv, createDecipheriv, randomBytes } = require('crypto');
const {createReadStream , createWriteStream, fstat} = require('fs');
const { pipeline } = require('stream');

const algorithm = 'aes-256-ctr';
const password = 'password1234';
const iv = randomBytes(16);

const cipherTextEx = (textname) => {
    return new Promise((resolve) => {
        input = createReadStream(textname);
        outputciph = createWriteStream("ciphertext.enc");

        scrypt(password, "salt", 32, (error, key) => {
            if (error) {
                throw error;
            }
            console.log(key);
            const cipher = createCipheriv(algorithm, key, iv);
            input.pipe(cipher).pipe(outputciph);
            outputciph.on('finish', () => {
                console.log("finish encryption");
                resolve(true);
            });
           
        });
    });
}

const decipherText = async (textname) => {
    inputcip = createReadStream(textname);
    outdec = createWriteStream("decoded.txt");
    return new Promise( (resolve) => {
        scrypt(password,"salt", 32, (error, key) => {
            if(error){
                throw error;
            }
            console.log(key);
            const decipher = createDecipheriv(algorithm, key, iv);
    
            inputcip.pipe(decipher).pipe(outdec);
            outdec.on("finish", () => {
                console.log("finish decryption");
                resolve(true);
            })
        });
    });
}

cipherTextEx("text.txt")
.then( (val) => {
    if(val){
        return decipherText("ciphertext.enc");
    }
})
.then( (val) => {
    if(val) {
        console.log("FINISH ALL");
    }
})
.catch(error => {
    console.log(error);
});

// decipherText("ciphertext.enc")
// .then(() => {

// })
// .catch(error => {
//     console.log(error);
// });