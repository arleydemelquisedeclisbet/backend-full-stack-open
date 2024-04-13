export const idGenerator = () => {
    const numbersStr = "0123456789" // Caracteres permitidos para el ID numérico
    const length = Math.floor(Math.random() * 6) + 5 // Longitud de id entre 5 y 10 caracteres
    let idArray = []

    // Generar un ID numérico aleatorio del tamaño especificado
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * numbersStr.length)
        const randomCharacter = numbersStr.charAt(randomIndex)
        idArray = idArray.concat(randomCharacter)
    }

    // Convertir el array de caracteres en una cadena numérica
    const numericId = parseInt(idArray.join(""), 10)

    return numericId
}

export const isEmptyOrWhitespace = str => {
    // Verificar si el valor es null, undefined o no es una cadena
    if (str == null || str === undefined || typeof str !== 'string') {
        return true;
    }

    // Eliminar espacios en blanco al inicio y al final de la cadena y verificar la longitud
    if (str.trim().length === 0) {
        return true; // La cadena está vacía o contiene solo espacios en blanco
    }

    return false; // La cadena no es vacía ni contiene solo espacios en blanco
}
