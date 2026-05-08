import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'lottery_history'

/**
 * @typedef {Object} HistoryItem
 * @property {number} timestamp - 抽签时间戳
 * @property {string} timeStr - 格式化的时间字符串
 * @property {Array<{id: number, name: string, number: string}>} results - 抽签结果
 */

/**
 * @returns {{
 *   history: HistoryItem[],
 *   addHistory: (results: Array<{id: number, name: string, number: string}>) => void,
 *   clearHistory: () => void
 * }}
 */
function useLotteryHistory() {
  const [history, setHistory] = useState([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setHistory(JSON.parse(stored))
      }
    } catch (e) {
      console.error('Failed to load history from localStorage:', e)
    }

    const handleStorage = (e) => {
      if (e.key === STORAGE_KEY) {
        try {
          const newVal = e.newValue ? JSON.parse(e.newValue) : []
          setHistory(newVal)
        } catch (err) {
          console.error('Failed to parse storage event:', err)
        }
      }
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const persist = useCallback((items) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch (e) {
      console.error('Failed to persist history:', e)
    }
  }, [])

  const addHistory = useCallback((results) => {
    const now = Date.now()
    const timeStr = new Date(now).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
    const entry = { timestamp: now, timeStr, results }
    setHistory((prev) => {
      const updated = [entry, ...prev]
      persist(updated)
      return updated
    })
  }, [persist])

  const clearHistory = useCallback(() => {
    setHistory([])
    persist([])
  }, [persist])

  return { history, addHistory, clearHistory }
}

export default useLotteryHistory
