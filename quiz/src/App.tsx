import React, { useState } from 'react'
import { storage, firestore } from './firebase/'
import './App.css'
import 'antd/dist/antd.dark.css'
import { Layout, Menu, Typography } from 'antd'
import SubmitForm from './SubmitForm'
import LogoSrc from './assets/coding.svg'
import { Code } from './types';
import { v4 as uuidv4 } from 'uuid';
import Game from './Game'

const { Text } = Typography

const { Header, Content, Footer } = Layout;

// enum to control the content of the website
enum ActiveContext {
  HOME,
  PLAY,
  POST
}

function App() {
  // const [image, setImage] = useState("");
  const [activeContext, setActiveContext] = useState<ActiveContext>(ActiveContext.HOME)

  const addImageToStorage = async (file: Blob) => {
    const uniqueId = uuidv4();
    const storageRef = storage.ref()
    const fileRef = storageRef.child(`${uniqueId}.png`)
    await fileRef.put(file)
    const fileUrl = await fileRef.getDownloadURL()
    console.log(fileUrl)
    return { fileUrl, uniqueId }
  }

  const handleAddNewCode = async (code: Code) => {
    console.log('Callabck: handleSubmitCode ', code)
    const { fileUrl, uniqueId } = await addImageToStorage(code.image)
    code.image = fileUrl
    console.log(code)
    if (fileUrl) {
      firestore.collection('code_samples').doc(uniqueId).set(code)
    }
  }

  let context: React.ReactElement;
  if (activeContext === ActiveContext.HOME) {
    context = <>
      <h1>Welcome! 👋 </h1>
      <Text style={{ textAlign: 'center' }}>To play the game go to the Play tab!<br />
        You will have 60 seconds to quess the program output as many times as you can!<br />
        Good luck 🙂 <br /><br />
        You can also add your own problems by going to the Post tab!
      </Text>
    </>
  } else if (activeContext === ActiveContext.PLAY) {
    context = <Game db={firestore} />
  } else if (activeContext === ActiveContext.POST) {
    context = <SubmitForm addNewCode={handleAddNewCode} />
  } else {
    context = <h1>Not implemented! 🐛 </h1>
  }

  return (
    <Layout className="layout">
      <Header className="header">
        <div className="logo">
          <img src={LogoSrc} alt="code" />
        </div>
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
          <Menu.Item onClick={() => { setActiveContext(ActiveContext.HOME) }} key='1'>Home</Menu.Item>
          <Menu.Item onClick={() => { setActiveContext(ActiveContext.PLAY) }} key='2'>Play</Menu.Item>
          <Menu.Item onClick={() => { setActiveContext(ActiveContext.POST) }} key='3'>Post</Menu.Item>
        </Menu>
      </Header>
      <Content>
        <div className="App-header">
          {context}
        </div>
      </Content>
      <Footer className="App">Coding Quiz ©2021 Created by Kuba Szpak - Kredek</Footer>
    </Layout >
  );
}

export default App;
