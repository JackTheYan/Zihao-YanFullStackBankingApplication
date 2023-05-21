import React, { useState } from 'react';
import { Input } from 'antd';

const Index = ({ onChange, value }) => {
    

    const handleChange = (e) => {
        if(e.target.value) {
            return onChange(e.target.value.replace(/\s/g, '').replace(/[^\d]/g, '').replace(/(\d{4})(?=\d)/g,
            '$1 '))


        }
        return onChange(e.target.value)
    }
    return (
        <Input value={value} onChange={handleChange}/>
    )
}

export default Index;