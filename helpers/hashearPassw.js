const bcrypt = require('bcrypt')

const hashear = async codigo => {
    if(!codigo) return codigo
    
    const salt = await bcrypt.genSalt(10)
    const hasheado = await bcrypt.hash(codigo, salt)
    return hasheado
}

module.exports = hashear