import './style.css'
import { BLOCK_SIZE, BOARD_Height, BOARD_WIDTH } from './const'
import { piece, PIECES } from './pieces'

const canvas = document.querySelector('canvas') as HTMLCanvasElement
const context = canvas.getContext('2d') as CanvasRenderingContext2D

let score = 0
let level = 0

canvas.width = BLOCK_SIZE * BOARD_WIDTH
canvas.height = BLOCK_SIZE * BOARD_Height

context.scale(BLOCK_SIZE, BLOCK_SIZE)

const board = createBoard(BOARD_WIDTH, BOARD_Height)

function createBoard(width:number, height: number){
  return Array(height).fill(0).map(()=> Array(width).fill(0))
}

let dropcounter = 100
let lasttime = 0
let time = 0

function update(time:number){
  const deltatime = time - lasttime
  lasttime = time
  dropcounter += deltatime

  if(dropcounter > 1000){
    piece.position.y++
    dropcounter = 0
    if(checkCollision()){
      piece.position.y--
      solidifyPiece()
      removeRows()
    }
  }

  draw()
  window.requestAnimationFrame(update)
}

function draw(){
  
  context.fillStyle = '#000'
  context.fillRect(0, 0, canvas.width, canvas.height)

  board.forEach((row, y) =>{
    row.forEach((value, x)=>{
      if(value === 1){
        context.fillStyle = '#0000ff'
        context.fillRect(x, y, 1, 1)
      }
    })
  })

  piece.shape.forEach((row, y) =>{
    row.forEach((value, x) =>{
      if(value === 1){
        context.fillStyle = '#ff0000'
        context.fillRect(x + piece.position.x, y + piece.position.y, 1, 1)
      }
    })
  })

  let scoretext = document.getElementById('score') as HTMLSpanElement
  scoretext.innerText = score.toString()

  let leveltext = document.getElementById('level') as HTMLSpanElement
  leveltext.innerText = level.toString()
}

 document.addEventListener('keydown', event =>{
  if(event.key === 'ArrowLeft'){
    piece.position.x--
    if(checkCollision()){
      piece.position.x++
    }
  }
  if(event.key === 'ArrowRight'){
    piece.position.x++
    if(checkCollision()){
      piece.position.x--
    }
  }
  if(event.key === 'ArrowDown'){
    piece.position.y++
    if(checkCollision()){
      piece.position.y--
      solidifyPiece()
      removeRows()
    }
  }

  if(event.key === 'ArrowUp'){
    const rotar = Array()
    for(let i = 0; i < piece.shape[0].length; i++){
      const row = Array()
     
      for(let j = piece.shape.length - 1; j >= 0; j--){
        row.push(piece.shape[j][i])
      }

      rotar.push(row)
    }
    
    if(!checkCollision()){
      piece.shape = rotar
    }   
  }
 })

 function checkCollision(){
  return piece.shape.find((row, y) =>{
    return row.find((value, x) =>{
      return (
        value != 0 
        && board[y + piece.position.y]?.[x + piece.position.x] != 0
        )
    })
  })
 }

 function solidifyPiece(){
  piece.shape.forEach((row, y) =>{
    row.forEach((value, x) =>{
      if(value === 1){
        board[y + piece.position.y][x + piece.position.x] = 1
      }
    })
  })
  
  piece.position.x = 0
  piece.position.y = 0

  piece.shape = PIECES[Math.floor(Math.random() * PIECES.length)]

  if(checkCollision()){
    window.alert('Game Over!! Sorry ')
    board.forEach((row) => row.fill(0))
  }
 }

 function removeRows(){
  const rowtoremove = Array()

  board.forEach((row, y) => {
    if(row.every(value => value === 1)){
      rowtoremove.push(y)
    }
  })

  rowtoremove.forEach(element => {
    board.splice(element, 1)
    const newRow = Array(BOARD_WIDTH).fill(0)
    board.unshift(newRow)
    score += 10
    levels(score)
  });
 }

 function levels(score:number){
  if((score % 100) === 0){
    level++
    time++
  }
 }

 update(time) 