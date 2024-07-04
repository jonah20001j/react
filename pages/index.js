import Head from 'next/head'                              // 引入 Head 元件來設置頁面的 <head> 內容
import { useState, useEffect } from 'react'               // 引入 React 的 useState 和 useEffect Hook
import Layout, { siteTitle } from '../components/layout'  // 引入自定義的 Layout 元件和 siteTitle
import utilStyles from '../styles/utils.module.css'       // 引入自定義的樣式
import modalStyles from '../styles/modal.module.css'      // 引入模態框樣式

let number = 0 // 用於追踪選手數量的變量
let courtNumber = 1 // 用於追踪場地數量的變量

export default function Home() {

  const [courts, setCourts] = useState([                       // 初始化場地數據的狀態
    {
      alt: courtNumber,
      competingPlayers: [],
      team1: [],
      team2: [],
      isGameing: false
    },
  ])
  const [items, setPlayer] = useState([])                      // 初始化選手數據的狀態
  const [selectedCourts, setSelectedCourts] = useState([])     // 用於選擇場地
  const [selectedPlayers, setSelectedPlayers] = useState([])   // 用於選擇選手
  const [players, setBattlePlayers] = useState([])             // 初始化要顯示的選手數組
  const [isModalOpen, setIsModalOpen] = useState(false)        // 控制模態框的狀態
  const [batchNames, setBatchNames] = useState('')             // 批次增加選手的名稱
  const [countdown, setCountdown] = useState(2)                // 倒數計時器
  const [intervalId, setIntervalId] = useState(null)           // 計時器 ID
  const [selectedCourt, setSelectedCourt] = useState(null)     // 被選中的場地
  const [scoreModalOpen, setScoreModalOpen] = useState(false)  // 控制分數輸入模態框的狀態
  const [team1Score, setTeam1Score] = useState(0)              // Team 1 的分數
  const [team2Score, setTeam2Score] = useState(0)              // Team 2 的分數

  // 處理增加場地的函數
  const addCourt = () => {

    ++courtNumber // 場地編號加  1
    setCourts([...courts, {
      alt: courtNumber,
      competingPlayers: [],
      team1: [],
      team2: [],
      isGameing: false
    }])
  }

  // 處理減少場地的函數
  const removeCourt = () => {
    if (courts.length > 1) {
      // 選擇場地進行刪除
      setCourts(courts.filter(item => !selectedCourts.includes(item.alt)))
      // 清空選擇的場地
      setSelectedCourts([])
    } else {
      // 場地少於一個時彈出警告
      alert("已經不能再刪除場地了")
    }
  }

  // 處理增加選手的函數
  const addPlayers = () => {
    ++number // 選手數量加 1
    const newPlayer = {
      id: number,
      title: `player_${number}`,
      score: 100,
      playerTimes: 0
    }
    setPlayer([...items, newPlayer]) // 更新選手數據
  }

  // 處理減少選手的函數
  const removeItem = () => {
    if (items.length > 0) {
      // 選擇選手進行刪除
      items.filter(item => selectedPlayers.includes(item.id))
      // 更新選手數據
      setPlayer(items.filter(item => !selectedPlayers.includes(item.id)))
      // 清空選擇的選手
      setSelectedPlayers([])
    } else {
      // 選手數量為零時彈出警告
      alert("已經不能再刪除物件了")
    }
  }

  // 處理將選手添加到備戰區的函數
  const addToBattlePlayers = () => {
    // 選擇選手進行添加
    items.filter(item => selectedPlayers.includes(item.id))
    // 更新備戰區選手數據
    setBattlePlayers([...players, ...newBattlePlayers])
    // 更新選手數據
    setPlayer(items.filter(item => !selectedPlayers.includes(item.id)))
    // 清空選擇的選手
    setSelectedPlayers([])
  }

  // 將選手退回選手區
  const backToItems = (player) => {
    // 更新選手數據
    setPlayer([...items, player])
    // 從備戰區移除選手
    setBattlePlayers(players.filter(p => p.id !== player.id))
  }

  // 開啟模態框
  const openModal = () => {
    setIsModalOpen(true)
  }

  // 關閉模態框
  const closeModal = () => {
    setIsModalOpen(false)
  }

  // 批次增加選手的處理函數
  const handleBatchAdd = () => {
    if (batchNames.trim()) {
      const namesArray = batchNames.split('\n').map((name, index) => ({
        id: items.length + index + 1,
        title: name.trim(),
        score: 600,
      }))
      // 更新選手數據
      setPlayer([...items, ...namesArray])
      // 清空輸入框
      setBatchNames('')
      // 關閉模態框
      closeModal()
    }
  }

  // 倒數計時與選手分配邏輯
  useEffect(() => {
    const id = setInterval(() => {
      setCountdown(prevCountdown => {
        if (prevCountdown === 1) {
          // 執行選手分配邏輯
          if (players.length >= 4) {
            const emptyCourtIndex = courts.findIndex(court => court.isGameing === false)
            if (emptyCourtIndex !== -1) {
              const shuffledPlayers = players.sort(() => 0.5 - Math.random())
              const selectedPlayers = shuffledPlayers.slice(0, 4)
              const remainingPlayers = players.filter(player => !selectedPlayers.includes(player))
              const updatedCourts = [...courts]
              updatedCourts[emptyCourtIndex].competingPlayers = selectedPlayers
              setCourts(updatedCourts)
              setBattlePlayers(remainingPlayers)

              // 按分數排序選手
              const sortedPlayers = selectedPlayers.sort((a, b) => b.score - a.score)
              const team1 = sortedPlayers.slice(0, 2) // 高分選手
              const team2 = sortedPlayers.slice(2) // 低分選手

              updatedCourts[emptyCourtIndex].team1 = team1
              updatedCourts[emptyCourtIndex].team2 = team2
              updatedCourts[emptyCourtIndex].isGameing = true
              const playerNames = selectedPlayers.map(player => player.title).join(', ')
              const utterance = new SpeechSynthesisUtterance(`在場地 ${emptyCourtIndex + 1} 比賽的選手有 ${playerNames}`)
              speechSynthesis.speak(utterance)
            }
          }
          // 重置倒數計時
          return 3
        }
        // 減少倒數計時
        return prevCountdown - 1
      })
    }, 1000) // 每秒執行一次
    setIntervalId(id)
    // 清除計時器
    return () => clearInterval(id)
  }, [players, courts])

  // 處理選擇場地和選手的函數
  const handleSelectItem = (id, type) => {
    if (type === 'court') {
      if (selectedCourts.includes(id)) {
        setSelectedCourts(selectedCourts.filter(item => item !== id))
      } else {
        setSelectedCourts([id])
      }
    } else if (type === 'player') {
      if (selectedPlayers.includes(id)) {
        setSelectedPlayers(selectedPlayers.filter(item => item !== id))
      } else {
        setSelectedPlayers([...selectedPlayers, id])
      }
    }
  }

  // 處理提交分數的函數
  const handleScoreSubmit = () => {
    if (selectedCourt !== null) {
      const updatedCourts = [...courts]
      const court = updatedCourts.find(court => court.alt === selectedCourt)

      if (court) {
        const scoreDifference = Math.abs(team1Score - team2Score)

        // 更新 team1 和 team2 選手的分數
        court.team1.forEach(player => {
          player.score += team1Score > team2Score ? scoreDifference : -scoreDifference
        })

        court.team2.forEach(player => {
          player.score += team2Score > team1Score ? scoreDifference : -scoreDifference
        })

        setCourts(updatedCourts)
        setScoreModalOpen(false)
        setTeam1Score(0)
        setTeam2Score(0)
        setSelectedCourt(null) // 重置選擇的場地
      }
    }
  }

  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>

      <section className={utilStyles.headingMd}>
        <button className={utilStyles.removeButton} onClick={removeCourt}>減少場地</button>
        <button className={utilStyles.addButton} onClick={addCourt}>增加場地</button>
        <button className={utilStyles.addButton} onClick={() => {
          if (selectedCourts.length === 1) {
            const selectedCourtAlt = selectedCourts[0]
            const selectedCourt = courts.find(court => court.alt === selectedCourtAlt)
            if (selectedCourt && selectedCourt.isGameing) {
              setSelectedCourt(selectedCourtAlt)
              setScoreModalOpen(true)
            } else {
              alert("只能為正在比賽中的場地計分")
            }
          } else {
            alert("請選擇一個場地來計分")
          }
        }}>計分</button>
        <div className={utilStyles.flexContainer}>
        {
          courts.map((court, index) => (
            <div
              key={index}
              style={{
                backgroundImage: "url('/images/badmintionCourt.png')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                position: 'relative'
              }}
              className={`${utilStyles.courtContainer} ${selectedCourts.includes(court.alt) ? utilStyles.selected : ''}`}
              onClick={() => handleSelectItem(court.alt, 'court')}
            >
              <div className={utilStyles.courtNumber}>
                場地:{index + 1}, {court.isGameing ? '比賽中' : '等待中'} {countdown + 1}
              </div>
              {court.team1.length > 0 && (
                <>
                  <div className={`${utilStyles.playerInfo} ${utilStyles.team1Left}`}>
                    <h3>{court.team1[0].title}</h3>
                    <p>{court.team1[0].score}</p>
                  </div>
                  <div className={`${utilStyles.playerInfo} ${utilStyles.team1Right}`}>
                    <h3>{court.team1[1].title}</h3>
                    <p>{court.team1[1].score}</p>
                  </div>
                </>
              )}
              {court.team2.length > 0 && (
                <>
                  <div className={`${utilStyles.playerInfo} ${utilStyles.team2Left}`}>
                    <h3>{court.team2[0].title}</h3>
                    <p>{court.team2[0].score}</p>
                  </div>
                  <div className={`${utilStyles.playerInfo} ${utilStyles.team2Right}`}>
                    <h3>{court.team2[1].title}</h3>
                    <p>{court.team2[1].score}</p>
                  </div>
                </>
              )}
            </div>
          ))
        }
        </div>
      </section>

      {/* ========================================================================================================== */}
      <div> 備戰區</div>
      <section className={utilStyles.newSection}>
        <div className={utilStyles.flexContainer}>
          {
            players.map((player, index) => (
              <div
                key={index}
                className={`${utilStyles.itemBox} ${selectedPlayers.includes(player.id) ? utilStyles.selected : ''}`}
                onClick={() => handleSelectItem(player.id, 'player')}>
                <h3>{player.title}</h3>
                <p>{player.score}</p>
                <button onClick={() => backToItems(player)}>退回選手區</button>
              </div>
            ))
          }
        </div>
      </section>
      {/* ========================================================================================================== */}
      <div>選手區</div>
      <button className={utilStyles.addButton} onClick={openModal}>批次增加選手</button>
      <button className={utilStyles.removeButton} onClick={removeItem}>減少選手</button>
      <button className={utilStyles.addButton} onClick={addPlayers}>增加選手</button>
      <button className={utilStyles.addButton} onClick={addToBattlePlayers}>添加選中的選手到備戰區</button>
      <section className={`${utilStyles.newSection} ${modalStyles.autoExpand}`}>
        <div className={utilStyles.flexContainer}>
          {items.map(item => (
            <div key={item.id}
              className={`${utilStyles.itemBox} ${selectedPlayers.includes(item.id) ? utilStyles.selected : ''}`}
              onClick={() => handleSelectItem(item.id, 'player')}
            >
              <h3>{item.title}</h3>
              <p>{item.score}</p>
            </div>
          ))}
        </div>
      </section>
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
      {scoreModalOpen && (
        <div className={modalStyles.modal}>
          <div className={modalStyles.modalContent}>
            <h2>輸入分數 - 場地 {selectedCourt}</h2>
            <div>
              <label>Team 1 分數:</label>
              <input type="number" value={team1Score} onChange={(e) => setTeam1Score(parseInt(e.target.value))} />
            </div>
            <div>
              <label>Team 2 分數:</label>
              <input type="number" value={team2Score} onChange={(e) => setTeam2Score(parseInt(e.target.value))} />
            </div>
            <button onClick={handleScoreSubmit}>確認</button>
            <button onClick={() => setScoreModalOpen(false)}>取消</button>
          </div>
        </div>
      )}
    </Layout>
  )
}
