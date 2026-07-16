const prompt = require('prompt-sync')({ sigint: true });

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
  constructor(field) {
    this._field = field;
    this.row = 0;
    this.column = 0;
    this.playing = true;
  }

  print() {
    for (let row of this._field) {
      console.log(row.join(''));
    }
  }

  render() {
    console.clear();
    this.print();
  }

  isOutOfBounds(row, column) {
    return (
      row < 0 ||
      row >= this._field.length ||
      column < 0 ||
      column >= this._field[0].length
    );
  }

  getTile(row, column) {
    return this._field[row][column];
  }

  setTile(row, column, value) {
    this._field[row][column] = value;
  }

  move(direction) {
    let newRow = this.row;
    let newColumn = this.column;

    if (direction === 'w') {
      newRow--;
    } else if (direction === 's') {
      newRow++;
    } else if (direction === 'a') {
      newColumn--;
    } else if (direction === 'd') {
      newColumn++;
    } else {
      console.log('Please use only: w, a, s, d');
      return;
    }

    if (this.isOutOfBounds(newRow, newColumn)) {
      console.clear();
      console.log('You crossed outside of the boundaries, you lost!');
      this.playing = false;
      return;
    }

    const tile = this.getTile(newRow, newColumn);

    if (tile === hole) {
      console.clear();
      console.log('You finished on a hole, you lost!');
      this.playing = false;
      return;
    }

    if (tile === hat) {
      this.row = newRow;
      this.column = newColumn;
      this.setTile(this.row, this.column, pathCharacter);
      this.render();
      console.log('You finished on the hat, you won!');
      this.playing = false;
      return;
    }

    this.row = newRow;
    this.column = newColumn;
    this.setTile(this.row, this.column, pathCharacter);
    this.render();
  }

  play() {
    this.render();

    while (this.playing) {
      const direction = prompt('Direction (w/a/s/d): ').trim().toLowerCase();
      this.move(direction);
    }
  }

  static generateField(height, width, percentHoles = 0.2) {
    const field = [];

    for (let i = 0; i < height; i++) {
      const row = [];
      for (let j = 0; j < width; j++) {
        row.push(fieldCharacter);
      }
      field.push(row);
    }

    field[0][0] = pathCharacter;

    let hatRow;
    let hatCol;

    do {
      hatRow = Math.floor(Math.random() * height);
      hatCol = Math.floor(Math.random() * width);
    } while (hatRow === 0 && hatCol === 0);

    field[hatRow][hatCol] = hat;

    const totalCells = height * width;
    const holesToPlace = Math.floor(totalCells * percentHoles);

    let placedHoles = 0;

    while (placedHoles < holesToPlace) {
      const randomRow = Math.floor(Math.random() * height);
      const randomCol = Math.floor(Math.random() * width);

      if (field[randomRow][randomCol] === fieldCharacter) {
        field[randomRow][randomCol] = hole;
        placedHoles++;
      }
    }

    return field;
  }
}

const randomField = Field.generateField(10, 10, 0.2);
const myField = new Field(randomField);

myField.play();