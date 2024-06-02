import { JSEncrypt } from 'jsencrypt'

// 设置公钥、私钥（通常从服务器获取，这里仅为示例）
const publicKey =
  'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBALae/empHZ5/HurSbZKrPGT1h4KQZ7HzbM4CoxEuSbyGOhLCXolIA8Yyl+HiKnyC9TOJEW1c98IzpAnqPw40NEsCAwEAAQ=='
const privateKey =
  'MIIBVgIBADANBgkqhkiG9w0BAQEFAASCAUAwggE8AgEAAkEAtp796akdnn8e6tJtkqs8ZPWHgpBnsfNszgKjES5JvIY6EsJeiUgDxjKX4eIqfIL1M4kRbVz3wjOkCeo/DjQ0SwIDAQABAkAHcKbLlDY+tNMfof8Q0KUfP9mLejKfT1mJcxYNpyMd6RBoSct9lfTKCWkcuovk0EUc7RrhBiDD7yRMKQlCeJFBAiEA3vVwYOltR7naQm/JULcKyCVGRFWcc1J7XhOZwyoWbfECIQDRrzsALTwc40oIiVUyCt73cJzyeULvPa3lYcOYgrf5+wIhAKL6QrV0rF876eGamUwZIRaAuMaG1iAucOOp7EIPZ+nhAiEA0aY4gaa4sdF3Vi2ppw1DfXd1FOK1T+sFkZE8NaKNPD0CIQCAphmj+YFQCjPdBFr6p5b8/uOS+sQEdvvJ58WfoO0v5w=='

// 加密
function encryptText(text) {
  const instance = new JSEncrypt()
  instance.setPublicKey(publicKey)
  return instance.encrypt(text)
}

// 解密
function decryptText(text) {
  const instance = new JSEncrypt()
  instance.setPrivateKey(privateKey)
  return instance.decrypt(text)
}

export { encryptText, decryptText }
