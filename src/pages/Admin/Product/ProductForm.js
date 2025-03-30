import { Input, Select } from 'antd';
import { useEffect, useState } from 'react';

import { getAttributeByCategoryId } from '~/services/attributeService';
const { Option } = Select;

const entityListPage = '/admin/products';

function ProductForm() {
    const [attributeList, setAttributeList] = useState([]);
    const [attributeValues, setAttributeValues] = useState({});

    const handleChange = (attId, value) => {
        setAttributeValues((prev) => ({
            ...prev,
            [attId]: value,
        }));
    };

    useEffect(() => {
        const fetchAttributes = async () => {
            try {
                const response = await getAttributeByCategoryId(1);

                setAttributeList(response.data.data);
            } catch (error) {}
        };

        fetchAttributes();
    }, []);

    return (
        <>
            <div className="row g-3">
                {attributeList.map(({ id, name, required, defaultValue }) => (
                    <div key={id} className="col-md-6 col-12">
                        <label htmlFor={id}>
                            {required && <span className="text-danger">*</span>} {name}:
                        </label>

                        <Input
                            id={id}
                            name={id}
                            placeholder={`Nhập ${name}`}
                            value={attributeValues[id] || ''}
                            onChange={(e) => handleChange(id, e.target.value)}
                        />
                    </div>
                ))}
            </div>
        </>
    );
}

export default ProductForm;
