import Head from 'next/head';
import { useState } from 'react';
import Image from 'next/image';
import Layout, { siteTitle } from '../components/layout';
import utilStyles from '../styles/utils.module.css';
import modalStyles from '../styles/modal.module.css';

export default function Home() {
  // 初始化圖片數據
  const [images, setImages] = useState([
    { src: '/images/badmintionCourt.png', alt: 'Badminton Court 1', team1: [], team2: [] },
  ]);

  // 處理增加圖片的函數
  const addImage = () => {
    setImages([...images, {
      src: '/images/profile.jpg',
      alt: `Badminton Court ${images.length + 1}`,
      team1: [], team2: []
    }]);
  };

  // 處理減少圖片的函數
  const removeImage = () => {
    if (images.length > 1) {
      setImages(images.slice(0, -1)); // 移除數組中的最後一個元素
    } else {
      alert("已經不能再刪除圖片了");
    }
  };

  // 初始化要顯示的物件數組
  const [items, setItems] = useState([]);

  // 處理增加物件的函數
  const addItem = () => {
    const newItem = { id: items.length + 1, title: `Item ${items.length + 1}`, score: 100 };
    setItems([...items, newItem]);
  };

  // 處理減少物件的函數
  const removeItem = () => {
    if (items.length > 0) {
      setItems(items.slice(0, -1)); // 移除數組中的最後一個元素
    } else {
      alert("已經不能再刪除物件了");
    }
  };

  // 初始化要顯示的選手數組
  const [players, setPlayers] = useState([]);

  // 修改的函數: addToPlayers，負責將選手從選手區移動到備戰區並在選手區中移除
  const addToPlayers = (item) => {
    if (players.length < 4) {
      setPlayers([...players, item]);
      setItems(items.filter(i => i.id !== item.id)); // 從選手區移除該選手
    } else {
      alert("備戰區最多只能有4個選手");
    }
  };

  const backToItems = (player) => {
    setItems([...items, player]);
    setPlayers(players.filter(p => p.id !== player.id)); // 從備戰區移除該選手
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [batchNames, setBatchNames] = useState('');

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleBatchAdd = () => {
    if (batchNames.trim()) {
      const namesArray = batchNames.split('\n').map((name, index) => ({
        id: items.length + index + 1,
        title: name.trim(),
        score: 600,
      }));
      setItems([...items, ...namesArray]);
      setBatchNames('');
      closeModal();
    }
  };

  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <div className={utilStyles.flexContainer}>
          {
            images.map((image, index) => (
              <Image
                key={index}
                priority
                src={image.src}
                height={400}
                width={300}
                alt={image.alt}
              />
            ))
          }
        </div>
        <button className={utilStyles.removeButton} onClick={removeImage}>減少場地</button>
        <button className={utilStyles.addButton} onClick={addImage}>增加場地</button>
      </section>
      <div>
        備戰區
      </div>
      <section className={utilStyles.newSection}>
        <div className={utilStyles.flexContainer}>
          {
            players.map((player, index) => (
              <div key={index} className={utilStyles.itemBox}>
                <h3>{player.title}</h3>
                <p>{player.score}</p>
                <button onClick={() => backToItems(player)}>退回選手區</button>
              </div>
            ))
          }
        </div>
      </section>
      <div>
        選手區
      </div>
      <section className={`${utilStyles.newSection} ${modalStyles.autoExpand}`}>
        <div className={utilStyles.flexContainer}>
          {items.map(item => (
            <div key={item.id} className={utilStyles.itemBox}>
              <h3>{item.title}</h3>
              <p>{item.score}</p>
              <button onClick={() => addToPlayers(item)}>添加到備戰區</button>
            </div>
          ))}
        </div>
      </section>
      <button className={utilStyles.removeButton} onClick={removeItem}>減少選手</button>
      <button className={utilStyles.addButton} onClick={addItem}>增加選手</button>
      <button className={utilStyles.addButton} onClick={openModal}>批次增加選手</button>
      {isModalOpen && (
        <div className={modalStyles.modal}>
          <div className={modalStyles.modalContent}>
            <h2>批次增加選手</h2>
            <textarea
              value={batchNames}
              onChange={(e) => setBatchNames(e.target.value)}
              placeholder="請貼上選手名稱，以\n隔開"
              rows="10"
              cols="30"
            />
            <button onClick={handleBatchAdd}>確認增加</button>
            <button onClick={closeModal}>取消</button>
          </div>
        </div>
      )}
    </Layout>
  );
}
