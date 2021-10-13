import React, { useState } from 'react'
import { Form, Input, Button, Select, Radio } from 'antd';
import { AddNewCode } from './types';
import AceEditor from "react-ace"
import "ace-builds/webpack-resolver";
import "ace-builds/src-noconflict/ace";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-csharp";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools"
var randomHexColor = require('random-hex-color')

const { Option } = Select;

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};
const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};

const SubmitForm: React.FC<AddNewCode> = (props) => {
    const [selectedLanguage, setSelectedLanguage] = useState('javascript')
    const [codeSample, setCodeSample] = useState("")
    const [image, setImage] = useState("");

    const publishImageToApi = async () => {
        console.log('Invoked')
        let blob: any;
        const language = (selectedLanguage === 'csharp' || selectedLanguage === 'java') ? `text/x-${selectedLanguage}` : selectedLanguage
        try {
            const response = await fetch("/api", {
                method: 'POST', // or 'PUT'
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "code": codeSample,
                    "language": language,
                    "theme": "material",
                    "backgroundColor": randomHexColor()
                })
            });
            blob = await response.blob();
            console.log(blob)
            const url = URL.createObjectURL(blob);
            console.log(url)
            setImage(url)
        } catch (err) {
            console.error(err);
        }
        return blob;
    }


    const onFinish = async (values: any) => {
        if (!codeSample) return
        const blob = await publishImageToApi();
        values = { ...values, language: selectedLanguage, image: blob }
        console.log('Success:', values);
        props.addNewCode(values)
    };

    return (
        <>
            <Form
                {...layout}
                name="basic"
                initialValues={{ remember: true }}
                onFinish={onFinish}
            >

                <Select defaultValue="javascript" style={{ width: 120 }} onChange={(value) => { setSelectedLanguage(value) }}>
                    <Option value="javascript">Javascript</Option>
                    <Option value="python">Python</Option>
                    <Option value="java">Java</Option>
                    <Option value="csharp">C#</Option>
                </Select>

                <AceEditor
                style={{width:"600px"}}
                    value={codeSample}
                    placeholder="Enter your code"
                    mode={selectedLanguage}
                    theme="monokai"
                    onChange={(value) => { setCodeSample(value) }}
                    fontSize={18}
                    showPrintMargin={true}
                    showGutter={true}
                    highlightActiveLine={true}
                    setOptions={{
                        useWorker: false,
                        enableBasicAutocompletion: true,
                        enableLiveAutocompletion: true,
                        showLineNumbers: true
                    }}
                />

                <Form.Item
                    label="Answer A"
                    name="a"
                    rules={[{ required: true, message: 'Please input answer A!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Answer B"
                    name="b"
                    rules={[{ required: true, message: 'Please input answer B!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Answer C"
                    name="c"
                    rules={[{ required: true, message: 'Please input answer C!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="correct"
                    label="Correct"
                    rules={[{ required: true, message: 'Please pick witch answer is correct!' }]}
                >
                    <Radio.Group>
                        <Radio.Button value="a">A</Radio.Button>
                        <Radio.Button value="b">B</Radio.Button>
                        <Radio.Button value="c">C</Radio.Button>
                    </Radio.Group>
                </Form.Item>

                <Form.Item  {...tailLayout}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
            {image ? <img src={image} alt="logo" /> : null}
        </>
    );
}

export default SubmitForm;