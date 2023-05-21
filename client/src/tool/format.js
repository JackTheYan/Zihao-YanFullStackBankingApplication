function formatBankId(value) {
    if(!value) return '';
     return value.replace(/(.{4})/g, "$1 ");
}

export {
    formatBankId
};