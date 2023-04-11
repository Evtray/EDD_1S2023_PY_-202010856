class MatrizDispersa {
  constructor() {
    this.data = {};
    this.rows = 0;
    this.cols = 0;
    
  }

  insertar(value) {
    if (!this.data[this.rows]) {
      this.data[this.rows] = {};
    }
    this.data[this.rows][this.cols] = value;
  }

  obtener(row, col) {
    if (this.data[row] && this.data[row][col]) {
      return this.data[row][col];
    } else {
      return 0;
    }
  }

  eliminar(row, col) {
    if (this.data[row] && this.data[row][col]) {
      delete this.data[row][col];
      if (Object.keys(this.data[row]).length === 0) {
        delete this.data[row];
      }
      return true;
    } else {
      return false;
    }
  }
}
