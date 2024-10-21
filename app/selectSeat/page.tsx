'use client'
import React, { useState, useEffect, ReactNode } from 'react'
import {
  Select,
  message
} from 'antd'
import classNames from 'classnames'
import './style.scss'


interface AsileItem {
  type: 'row' | 'column'
  // 开始位置
  start: number
}

enum SeatState {
  // 可用
  available = 1,
  // 已选择
  selected = 2,
  // 已锁定
  occupied = 3

}

// 座位状态
interface SeatItem {
  bestViewArea: ReactNode
  x: number
  y: number
  type: 'seat' | 'aisle'
  state: SeatState
  children: SeatItem[]
}

interface SelectedMovieSeatItem {
  user: string
  movie: string
  price: number
  seatX: number
  seatY: number
}


const buildAisle = (arr: SeatItem[], aisleData: AsileItem[]) => {
  let updatedData = arr
    .filter((item) => item.type === 'seat')
    .map((item) => ({
      ...item,
      children: item.children.filter(
        (child: { type: string }) => child.type === 'seat'
      )
    }))

  aisleData.forEach((item) => {
    if (item.type === 'column' && updatedData.length !== 0) {
      // 构建列
      const findIndex = updatedData[0].children.findIndex(
        (child: any) => child.y + 1 === item.start
      )

      if (findIndex !== -1) {
        updatedData = updatedData.map((row) => {
          const newRow: any = [...row.children]
          newRow.splice(findIndex + 1, 0, { type: 'aisle' })
          return { ...row, children: newRow }
        })
      }
    } else if (item.type === 'row' && updatedData.length !== 0) {
      const findIndex = updatedData.findIndex(
        (row: any) => row.rowAxis === item.start
      )

      if (findIndex !== -1) {
        const newRow: SeatItem = {
          type: 'aisle',
          children: [],
          bestViewArea: false,
          x: -1,
          y: -1,
          state: SeatState.available
        
        }
        updatedData.splice(findIndex + 1, 0, newRow)
      }
    }
  })

  return updatedData
}




export default function SelectSeat() {
  const userData = [
    {
      name: 'Jack'
    },
    {
      name: 'Lucia'
    },
    {
      name: 'Tom'
    },
  ]

  const movieData = [
    {
      name: 'Avengers: Endgame',
      price: 10
    },
    {
      name: 'Joker',
      price: 12
    },
    {
      name: 'Toy Story',
      price: 8
    },
  ]

  const [user, setUser] = useState('')
  const [movie, setMovie] = useState('')
  const buildSeat = (row = 6, column = 8) => {
    const asileData = [
      {
        type: 'column',
        start: 2
      },
      {
        type: 'row',
        start: 2
      },
      {
        type: 'column',
        start: 6
      }
    ]
    const bestRegionStart = [2, 2]
    const bestRegionEnd = [3, 5]

    const createSeat = Array.from({
      length: row
    }).map((_, index) => {
      return {
        type: 'seat', 
        rowAxis: index + 1,
        children: new Array(column).fill({
          type: 'seat', 
          state: SeatState.available,
          
        }).map((children, childrenIndex) => {
          return {
            x: index,
            y: childrenIndex,
            bestViewArea:  index >= bestRegionStart[0] && index <= bestRegionEnd[0] && childrenIndex >= bestRegionStart[1] && childrenIndex <= bestRegionEnd[1],
            ...children,
          }
        })
      }
    })

    // @ts-ignore
    return buildAisle(createSeat, asileData)
  }
  const [selectedMovieSeat, setSelectedMovieSeat] = useState<SelectedMovieSeatItem[]>([])

  const [seatData, setSeatData] = useState(buildSeat())
  
 
  const [showResult, setShowResult] = useState<{[key: string]: SelectedMovieSeatItem[]}>({})

  
  const buildUserSelectSeat = (m: string = movie) => {
    const result = selectedMovieSeat
      .filter(item => item.movie === m)
      .reduce<{[key: string]: SelectedMovieSeatItem[]}>((obj, current) => {
      
        if (obj[current.user]) {
          obj[current.user] = obj[current.user].concat(current)
        } else {
          obj[current.user] = [current]
        }
    
        return obj
    }, {})

    setShowResult({...result})
  }

  useEffect(() => {
    const getUserSelectSeat = localStorage.getItem('userSelectSeat')

    if (getUserSelectSeat) {
      setSelectedMovieSeat(JSON.parse(getUserSelectSeat))
    }

  }, [])
  

  return (
    <section className='select-seat-container'>
      <ul className='form'>
        <li>
          <span>user：</span>
          <Select
            value={user}
            onChange={(val) => {
              setUser(val)

              const filter = selectedMovieSeat.filter(el => el.movie === movie)
              const newData = seatData.map(item => {
                return {
                  ...item,
                  children: item.children.map(children => {
                    const find = filter.find(el => el.seatX  === children.x && el.seatY === children.y)

                    return {
                      ...children,
                      state: find ? find.user === val ? SeatState.selected : SeatState.occupied : SeatState.available
                    }
                  })
                }
              })
              console.log(selectedMovieSeat)
              setSeatData(newData)
            }}
            options={userData.map(item => {
              return {
                value: item.name,
                label: item.name
              }
            })}
          />
        </li>
        <li>
          <span>Pick a movie：</span>
          <Select
            value={movie}
            onChange={(val) => {
              setMovie(val)
              // 清空座位
              const filter = selectedMovieSeat.filter(el => el.movie === val)
              const newData = seatData.map(item => {
                return {
                  ...item,
                  children: item.children.map(children => {
                    const find = filter.find(el => el.seatX  === children.x && el.seatY === children.y)

                    return {
                      ...children,
                      state: find ? find.user === user ? SeatState.selected : SeatState.occupied : SeatState.available
                    }
                  })
                }
              })

              setSeatData(newData)
              buildUserSelectSeat(val)
            }}
            options={movieData.map(item => {
              return {
                value: item.name,
                label: item.name + `($${item.price})`
              }
            })}
          />
        </li>
      </ul>
      <section className='seat-type'>
        <li>
          <span></span>
          <span>N/A</span>
        </li>
        <li>
          <span></span>
          <span>Selected</span>
        </li>
        <li>
          <span></span>
          <span>Occupied</span>
        </li>
      </section>
      <ul className='seat-box'>
        {
          seatData.map((item, index) => {
            return (
              <li key={index} className="seat-row">
                {
                  item.children.map((children, childrenIndex) => {

                    
                    if (children.type === 'seat') {
                      return (
                        
                        <div 
                          className={classNames('seat', {
                            'seat-available': children.state === SeatState.available,
                            'seat-selected': children.state === SeatState.selected,
                            'seat-occupied': children.state === SeatState.occupied,
                            'best-view-area': children.bestViewArea && children.state === SeatState.selected
                          }) }
                          key={`${index}-${childrenIndex}`}
                          onClick={() => {
                            if (!user) {
                              return message.warning('请选择用户')
                            }
                            if (!movie) {
                              return message.warning('请选择电影')
                            }

                            if (children.state !== SeatState.occupied) {
                              const oldState = seatData[index].children[childrenIndex].state
                              
                              seatData[index].children[childrenIndex].state = oldState === SeatState.available ? SeatState.selected :  SeatState.available

                              const selected = seatData[index].children[childrenIndex].state === SeatState.selected
                              
                              if (selected) {
                                const findMovie = movieData.find(item => item.name === movie)
                                const hasBestViewArea = seatData[index].children[childrenIndex].bestViewArea

                                selectedMovieSeat.push({
                                  user: user,
                                  movie: movie,
                                  seatX: children.x,
                                  seatY: children.y,
                                  price: hasBestViewArea ? findMovie!.price * 1.5 : findMovie!.price
                                })
                               
                                setSelectedMovieSeat([...selectedMovieSeat])
                              } else {
                                const findIndex = selectedMovieSeat.findIndex(item => item.user === user && item.movie === movie && item.seatX === index && item.seatY === childrenIndex)
                                selectedMovieSeat.splice(findIndex, 1)

                                setSelectedMovieSeat([...selectedMovieSeat])
                              }
                              
                              localStorage.setItem('userSelectSeat', JSON.stringify(selectedMovieSeat))
                              setSeatData([...seatData])
                            } else {
                              console.log('该座位不可选')
                            }

                            // 当前电影用户所选择的场次
                            buildUserSelectSeat()
                          }}>
                        </div>
                      )
                    } else {
                      return <div className='asile-asile' key={`${index}-${childrenIndex}`}></div>
                    }
                  })
                }
              </li>
            )
          })
        }
      </ul>
      <span>remaining seats in the cinema **</span>
      <ul>
        {
          Object.keys(showResult).map(item => {
            console.log(item)
            const price = showResult[item].reduce((total, current) => total + current.price, 0)

            return (
              <li key={item}>
                {item} have selected <span className='highlight'>${showResult[item].length}</span> seats for a price of $<span className='highlight'>{price}</span>
              </li>
            )
          })
        }
        
      </ul>
    </section>
  )
}
