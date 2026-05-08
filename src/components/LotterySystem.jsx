import { useState, useEffect, useRef } from 'react'

const SPEED_OPTIONS = [
  { label: '快速', value: 50 },
  { label: '中速', value: 150 },
  { label: '慢速', value: 300 },
]

const QUANTITY_OPTIONS = [1, 2, 3, 5, 10]

function LotterySystem() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [isDrawing, setIsDrawing] = useState(false)
  const [results, setResults] = useState([])
  const [currentDisplay, setCurrentDisplay] = useState(null)
  const [speed, setSpeed] = useState(150) // 中速
  const [quantity, setQuantity] = useState(1)
  const [customSpeed, setCustomSpeed] = useState(150)
  const [useCustomSpeed, setUseCustomSpeed] = useState(false)
  const [availableCount, setAvailableCount] = useState(0)
  
  const animationRef = useRef(null)
  const availableItemsRef = useRef([])

  // 加载数据
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      // 动态加载 data.js
      const script = document.createElement('script')
      script.src = '/data.js'
      script.onload = () => {
        // 等待一下确保数据已加载到 window
        setTimeout(() => {
          const lotteryData = window.lotteryData || []
          if (lotteryData.length === 0) {
            console.error('No data found in data.js')
            setLoading(false)
            return
          }
          setData(lotteryData)
          availableItemsRef.current = [...lotteryData]
          setAvailableCount(lotteryData.length)
          setLoading(false)
        }, 100)
      }
      script.onerror = () => {
        console.error('Failed to load data.js')
        setLoading(false)
      }
      document.head.appendChild(script)
    } catch (error) {
      console.error('Error loading data:', error)
      setLoading(false)
    }
  }

  // 随机抽取
  const drawLottery = () => {
    if (isDrawing || availableCount === 0) return

    setIsDrawing(true)
    setResults([])
    setCurrentDisplay(null)

    const available = [...availableItemsRef.current]
    const targetQuantity = Math.min(quantity, available.length)
    const currentSpeed = useCustomSpeed ? customSpeed : speed

    let iteration = 0
    const maxIterations = 30 + Math.floor(Math.random() * 20) // 30-50次滚动

    const animate = () => {
      if (iteration < maxIterations) {
        // 随机显示一个候选项
        const randomIndex = Math.floor(Math.random() * available.length)
        setCurrentDisplay(available[randomIndex])
        iteration++
        animationRef.current = setTimeout(animate, currentSpeed)
      } else {
        // 动画结束，确定最终结果
        const finalResults = []
        const tempAvailable = [...available]

        for (let i = 0; i < targetQuantity; i++) {
          if (tempAvailable.length === 0) break
          const randomIndex = Math.floor(Math.random() * tempAvailable.length)
          const selectedItem = tempAvailable.splice(randomIndex, 1)[0]
          finalResults.push(selectedItem)
        }

        // 从可用列表中移除已选中的项
        finalResults.forEach(item => {
          const index = availableItemsRef.current.findIndex(d => d.id === item.id)
          if (index > -1) {
            availableItemsRef.current.splice(index, 1)
          }
        })

        setResults(finalResults)
        setAvailableCount(availableItemsRef.current.length)
        setCurrentDisplay(null)
        setIsDrawing(false)
      }
    }

    animate()
  }

  // 重置
  const reset = () => {
    if (animationRef.current) {
      clearTimeout(animationRef.current)
    }
    setIsDrawing(false)
    setResults([])
    setCurrentDisplay(null)
    availableItemsRef.current = [...data]
    setAvailableCount(data.length)
  }

  // 再次抽签（不清空已选）
  const drawAgain = () => {
    if (availableCount === 0) {
      alert('所有候选项已被抽完，请重置后重新开始！')
      return
    }
    drawLottery()
  }

  return (
    <div className="h-screen overflow-hidden flex flex-col relative">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
      
      <div className="flex-1 overflow-hidden px-4 sm:px-6 py-4 relative z-10">
        <div className="h-full flex flex-col max-w-7xl mx-auto">
          {/* 标题区域 - 美化版 */}
          <header className="text-center mb-4 flex-shrink-0">
            <div className="inline-block mb-2">
              <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-orange-600 bg-clip-text text-transparent text-shadow-lg mb-2">
                随机抽签系统
              </h1>
              <div className="h-1 w-24 mx-auto bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500 rounded-full"></div>
            </div>
            <p className="text-sm text-gray-600 font-medium">
              ✨ 公平、透明、有趣的随机抽签工具
            </p>
          </header>

          {/* 数据加载状态 */}
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500 opacity-20 animate-pulse"></div>
                  <div className="relative inline-block animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-blue-600 border-r-purple-600"></div>
                </div>
                <p className="mt-4 text-sm text-gray-600 font-medium">正在加载数据...</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-3 min-h-0">
              {/* 左侧：统计信息和操作区域 */}
              <div className="lg:col-span-2 flex flex-col space-y-3 min-h-0">
                {/* 统计信息 - 美化版 */}
                <div className="relative overflow-hidden rounded-xl shadow-xl p-4 flex-shrink-0 shine-effect">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-orange-600 opacity-90"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                  <div className="relative flex items-center justify-around text-white">
                    <div className="text-center transform transition-transform hover:scale-110">
                      <div className="text-3xl font-extrabold mb-1 drop-shadow-lg">{data.length}</div>
                      <div className="text-xs font-medium opacity-95 tracking-wide">总候选项</div>
                    </div>
                    <div className="w-px h-10 bg-white/40 rounded-full"></div>
                    <div className="text-center transform transition-transform hover:scale-110">
                      <div className="text-3xl font-extrabold mb-1 drop-shadow-lg">{availableCount}</div>
                      <div className="text-xs font-medium opacity-95 tracking-wide">剩余可抽</div>
                    </div>
                    <div className="w-px h-10 bg-white/40 rounded-full"></div>
                    <div className="text-center transform transition-transform hover:scale-110">
                      <div className="text-3xl font-extrabold mb-1 drop-shadow-lg">{results.length}</div>
                      <div className="text-xs font-medium opacity-95 tracking-wide">已抽取</div>
                    </div>
                  </div>
                </div>

                {/* 操作区域 - 美化版 */}
                <section className="glass-dark rounded-xl shadow-xl p-4 flex-1 flex flex-col min-h-0 border border-gray-100">
                  <div className="flex items-center gap-2 mb-3 flex-shrink-0">
                    <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-orange-500 rounded-full"></div>
                    <h2 className="text-base font-bold text-gray-800">抽签设置</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3 flex-shrink-0">
                    {/* 滚动速度设置 */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">
                        滚动速度
                      </label>
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-2">
                          {SPEED_OPTIONS.map((option) => (
                            <button
                              key={option.value}
                              onClick={() => {
                                setSpeed(option.value)
                                setUseCustomSpeed(false)
                              }}
                              disabled={isDrawing}
                              className={`px-4 py-2 text-xs rounded-lg font-semibold transition-all duration-300 button-active ${
                                !useCustomSpeed && speed === option.value
                                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/50 scale-105'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:shadow-md border border-gray-200'
                              } ${isDrawing ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="customSpeed"
                            checked={useCustomSpeed}
                            onChange={(e) => setUseCustomSpeed(e.target.checked)}
                            disabled={isDrawing}
                            className="w-3 h-3 text-primary-600 rounded focus:ring-primary-500"
                          />
                          <label htmlFor="customSpeed" className="text-xs text-gray-700">
                            自定义
                          </label>
                          {useCustomSpeed && (
                            <input
                              type="number"
                              min="30"
                              max="1000"
                              value={customSpeed}
                              onChange={(e) => setCustomSpeed(Number(e.target.value))}
                              disabled={isDrawing}
                              className="w-20 px-2 py-1 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* 抽选数量设置 */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">
                        抽选数量
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {QUANTITY_OPTIONS.map((num) => (
                          <button
                            key={num}
                            onClick={() => setQuantity(num)}
                            disabled={isDrawing}
                            className={`px-4 py-2 text-xs rounded-lg font-semibold transition-all duration-300 button-active ${
                              quantity === num
                                ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg shadow-orange-500/50 scale-105'
                                : 'bg-gray-100 text-gray-700 hover:bg-gradient-to-r hover:from-orange-50 hover:to-pink-50 hover:shadow-md border border-gray-200'
                            } ${isDrawing ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            {num}人
                          </button>
                        ))}
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        最多可抽 {availableCount} 人
                      </p>
                    </div>
                  </div>

                  {/* 操作按钮 - 美化版 */}
                  <div className="flex flex-wrap gap-3 justify-center flex-shrink-0 mt-auto pt-3">
                    <button
                      onClick={drawLottery}
                      disabled={isDrawing || availableCount === 0}
                      className={`px-8 py-3 rounded-xl font-bold text-sm transition-all duration-300 button-active shine-effect ${
                        isDrawing || availableCount === 0
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                          : 'bg-gradient-to-r from-blue-600 via-purple-600 to-orange-600 text-white shadow-xl shadow-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/60 hover:scale-105'
                      }`}
                    >
                      {isDrawing ? '🎲 抽签中...' : '🚀 开始抽签'}
                    </button>
                    <button
                      onClick={drawAgain}
                      disabled={isDrawing || availableCount === 0}
                      className={`px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 button-active shine-effect ${
                        isDrawing || availableCount === 0
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                          : 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-xl shadow-orange-500/50 hover:shadow-2xl hover:shadow-orange-500/60 hover:scale-105'
                      }`}
                    >
                      🔄 再次抽签
                    </button>
                    <button
                      onClick={reset}
                      disabled={isDrawing}
                      className={`px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 button-active ${
                        isDrawing
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                          : 'bg-white text-gray-700 shadow-lg border-2 border-gray-200 hover:bg-gray-50 hover:shadow-xl hover:scale-105'
                      }`}
                    >
                      🔁 重置
                    </button>
                  </div>
                </section>
              </div>

              {/* 右侧：抽签动画和结果展示 */}
              <div className="lg:col-span-1 flex flex-col min-h-0 space-y-3">
                {/* 抽签动画展示区域 - 美化版 */}
                {(isDrawing || currentDisplay) ? (
                  <section className="relative overflow-hidden rounded-xl shadow-2xl p-5 flex-shrink-0 pulse-glow border-2 border-blue-300">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-400 to-orange-400 opacity-20"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                    <div className="relative text-center">
                      <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center justify-center gap-2">
                        <span className="animate-spin">🎲</span>
                        <span>抽签中...</span>
                      </h3>
                      {currentDisplay && (
                        <div className="inline-block glass-dark rounded-xl shadow-2xl p-6 card-hover border-2 border-white/50">
                          <div className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 drop-shadow-lg">
                            {currentDisplay.number}
                          </div>
                          <div className="text-xl font-bold text-gray-800">
                            {currentDisplay.name}
                          </div>
                        </div>
                      )}
                    </div>
                  </section>
                ) : results.length > 0 ? (
                  /* 结果展示区域 - 美化版 */
                  <section className="glass-dark rounded-xl shadow-xl p-4 flex-1 flex flex-col min-h-0 border border-gray-100">
                    <div className="flex items-center justify-center gap-2 mb-3 flex-shrink-0">
                      <div className="w-1 h-5 bg-gradient-to-b from-orange-500 to-pink-500 rounded-full"></div>
                      <h2 className="text-base font-bold text-gray-800">
                        🎉 抽签结果
                      </h2>
                    </div>
                    <div className="space-y-2.5 flex-1 overflow-y-auto pr-1">
                      {results.map((item, index) => (
                        <div
                          key={item.id}
                          className="relative overflow-hidden rounded-lg shadow-lg card-hover shine-effect group"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-orange-600 opacity-90"></div>
                          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                          <div className="relative p-3.5 text-white">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="text-xs font-medium opacity-95 mb-1.5 flex items-center gap-2">
                                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/30 text-xs font-bold">
                                    {index + 1}
                                  </span>
                                  <span>第 {index + 1} 名</span>
                                </div>
                                <div className="text-2xl font-extrabold mb-1 drop-shadow-lg">
                                  {item.number}
                                </div>
                                <div className="text-sm font-semibold opacity-95">
                                  {item.name}
                                </div>
                              </div>
                              <div className="ml-3 text-2xl opacity-80 group-hover:scale-110 transition-transform">
                                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🏅'}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                ) : (
                  <div className="glass-dark rounded-xl shadow-xl p-6 flex items-center justify-center flex-1 min-h-0 border border-gray-100">
                    <div className="text-center">
                      <div className="text-4xl mb-3 animate-bounce">🎯</div>
                      <p className="text-sm text-gray-500 font-medium">等待抽签结果...</p>
                    </div>
                  </div>
                )}

                {/* 提示信息 */}
                {availableCount === 0 && results.length > 0 && (
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-orange-400 p-3 rounded-lg flex-shrink-0 shadow-md">
                    <p className="text-xs text-orange-800 font-medium flex items-center gap-2">
                      <span className="text-base">💡</span>
                      <span><strong>提示：</strong>所有候选项已被抽完，点击"重置"重新开始。</span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default LotterySystem
