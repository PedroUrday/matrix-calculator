if (!String.prototype.includes) {
	String.prototype.includes = function (search, start) {
		'use strict';
		if (typeof start !== 'number') {
			start = 0;
		}

		if (start + search.length > this.length) {
			return false;
		} else {
			return this.indexOf(search, start) !== -1;
		}
	};
}

if (!String.prototype.startsWith) {
	String.prototype.startsWith = function (stringBuscada, posicion) {
		posicion = posicion || 0;
		return this.indexOf(stringBuscada, posicion) === posicion;
	};
}

document.addEventListener("DOMContentLoaded", function () {
	function greatest_common_divisor(a, b) {
		if (a.lt(0)) {
			a = a.times(-1);
		}
		if (b.lt(0)) {
			b = b.times(-1);
		}
		if (b.gt(a)) {
			var temp = a.times(1);
			a = b.times(1);
			b = temp;
		}
		if (b.eq(0)) {
			return new BigNumber(1);
		}
		if (a.mod(b).eq(0)) {
			return b.times(1);
		}
		return greatest_common_divisor(b.times(1), a.mod(b));
	}

	function Fraction(number) {
		if (number instanceof Fraction) {
			this.numerator = number.numerator;
			this.denominator = number.denominator;
		} else {
			if (typeof number == 'number' || typeof number == 'string') {
				number = new BigNumber(number);
			}
			var fraction_parts = number.toFraction();
			this.numerator = fraction_parts[0];
			this.denominator = fraction_parts[1];
		}
	}

	Fraction.prototype.eq = function (fraction) {
		if (!(fraction instanceof Fraction)) {
			fraction = new Fraction(fraction);
		}
		return this.numerator.eq(fraction.numerator) && this.denominator.eq(fraction.denominator);
	};

	Fraction.prototype.reduce = function () {
		var gcd = greatest_common_divisor(this.numerator, this.denominator);
		this.numerator = this.numerator.div(gcd);
		this.denominator = this.denominator.div(gcd);
		if ((this.numerator.lt(0) && this.denominator.lt(0)) || this.denominator.lt(0)) {
			this.numerator = this.numerator.times(-1);
			this.denominator = this.denominator.times(-1);
		}
		if (this.numerator.eq(0)) {
			this.denominator = new BigNumber(1);
		}
	};

	Fraction.prototype.plus = function (fraction) {
		if (!(fraction instanceof Fraction)) {
			fraction = new Fraction(fraction);
		}
		var result = new Fraction(1);
		result.numerator = this.numerator.times(fraction.denominator).plus(fraction.numerator.times(this.denominator));
		result.denominator = this.denominator.times(fraction.denominator);
		result.reduce();
		return result;
	};

	Fraction.prototype.minus = function (fraction) {
		if (!(fraction instanceof Fraction)) {
			fraction = new Fraction(fraction);
		}
		return this.plus(fraction.times(-1));
	}

	Fraction.prototype.times = function (fraction) {
		if (!(fraction instanceof Fraction)) {
			fraction = new Fraction(fraction);
		}
		var result = new Fraction(1);
		result.numerator = this.numerator.times(fraction.numerator);
		result.denominator = this.denominator.times(fraction.denominator);
		result.reduce();
		return result;
	};

	Fraction.prototype.div = function (fraction) {
		if (!(fraction instanceof Fraction)) {
			fraction = new Fraction(fraction);
		}
		var result = new Fraction(1);
		result.numerator = this.numerator.times(fraction.denominator);
		result.denominator = this.denominator.times(fraction.numerator);
		result.reduce();
		return result;
	};

	function swap_matrix_rows(matrix, column_count, row1, row2) {
		for (var col = 0; col < column_count; col++) {
			var temp = matrix[row1][col];
			matrix[row1][col] = matrix[row2][col];
			matrix[row2][col] = temp;
		}
	}

	function div_matrix_row_by_number(matrix, column_count, row, number) {
		for (var col = 0; col < column_count; col++) {
			matrix[row][col] = matrix[row][col].div(number);
		}
	}

	function subtract_matrix_row_by_row_multiple(matrix, column_count, row1, row2, multiple) {
		for (var col = 0; col < column_count; col++) {
			matrix[row1][col] = matrix[row1][col].minus(matrix[row2][col].times(multiple));
		}
	}

	function turn_matrix_echelon_matrix(matrix, row_count, column_count) {
		var max = Math.min(row_count, column_count);
		var row1 = 0;
		for (var col = 0; col < max; col++) {
			if (matrix[row1][col].eq(0)) {
				for (var row2 = row1 + 1; row2 < row_count; row2++) {
					if (matrix[row2][col] != 0) {
						swap_matrix_rows(matrix, column_count, row1, row2);
						break;
					}
				}
			}
			if (!matrix[row1][col].eq(0)) {
				div_matrix_row_by_number(matrix, column_count, row1, matrix[row1][col]);
				for (var row2 = 0; row2 < row_count; row2++) {
					if (row2 != row1 && matrix[row2][col] != 0) {
						subtract_matrix_row_by_row_multiple(matrix, column_count, row2, row1, matrix[row2][col]);
					}
				}
				row1++;
			}
		}
	}

	function create_matrix(row_count, column_count) {
		var matrix = [];
		for (var i = 0; i < row_count; i++) {
			matrix[i] = [];
			for (var j = 0; j < column_count; j++) {
				matrix[i][j] = null;
			}
		}
		return matrix;
	}

	function get_submatrix(matrix, row_count, column_count, row_to_remove, column_to_remove) {
		var submatrix = create_matrix(row_count - 1, column_count - 1);
		for (var i = 0; i < row_count; i++) {
			for (var j = 0; j < column_count; j++) {
				if (i != row_to_remove && j != column_to_remove) {
					if (i > row_to_remove && j > column_to_remove) {
						submatrix[i - 1][j - 1] = matrix[i][j];
					} else if (i > row_to_remove && j < column_to_remove) {
						submatrix[i - 1][j] = matrix[i][j];
					} else if (i < row_to_remove && j < column_to_remove) {
						submatrix[i][j] = matrix[i][j];
					} else if (i < row_to_remove && j > column_to_remove) {
						submatrix[i][j - 1] = matrix[i][j];
					}
				}
			}
		}
		return submatrix;
	}

	function matrix_determinant(matrix, row_count, column_count) {
		if (row_count == 1 && column_count == 1) {
			return matrix[0][0];
		} else if (row_count != column_count) {
			return false;
		}
		var determinant = new Fraction(0);
		for (var i = 0; i < row_count; i++) {
			var submatrix = get_submatrix(matrix, row_count, column_count, i, 0);
			var submatrix_determinant = matrix_determinant(submatrix, row_count - 1, column_count - 1);
			determinant = determinant.plus(matrix[i][0].times(submatrix_determinant).times(i % 2 == 0 ? 1 : -1));
		}
		return determinant;
	}

	function validate_number(str) {
		return /^(?:-?\d+(\.\d+)?|-?\d+ ?\/ ?\d+)$/g.test(str);
	}

	function parse_matrix(matrix, row_count, column_count) {
		var parsed = [];
		for (var row = 0; row < row_count; row++) {
			parsed[row] = [];
			for (var col = 0; col < column_count; col++) {
				parsed[row][col] = null;
				var str = matrix[row][col].trim();
				if (validate_number(str)) {
					if (str.includes('/')) {
						var parts = str.split('/');
						var numerator = new BigNumber(parts[0]);
						var denominator = new BigNumber(parts[1]);
						if (denominator.eq(0)) {
							return false;
						}
						var fraction = new Fraction(1);
						fraction.numerator = numerator;
						fraction.denominator = denominator;
						fraction.reduce();
						parsed[row][col] = fraction;
					} else {
						var number = new BigNumber(str);
						parsed[row][col] = new Fraction(number);
					}
				} else {
					return false;
				}
			}
		}
		return parsed;
	}

	function resize_matrix() {
		if (!Array.isArray(this.matrix)) {
			this.matrix = []
		}
		if (this.matrix.length > this.row_count) {
			this.matrix.length = this.row_count;
		}
		for (var i = 0; i < this.matrix.length; i++) {
			if (this.matrix[i].length > this.column_count) {
				this.matrix[i].length = this.column_count;
			}
		}
		for (var i = 0; i < this.row_count; i++) {
			if (typeof this.matrix[i] == 'undefined') {
				this.matrix[i] = []
			}
			for (var j = 0; j < this.column_count; j++) {
				if (typeof this.matrix[i][j] == 'undefined') {
					this.matrix[i][j] = ''
				}
			}
		}
	}

	new Vue({
		el: 'main',
		data: function () {
			var info = {
				row_count: 2,
				column_count: 2,
				matrix: [],
				echelon_matrix: false,
				determinant: false,
				fractions_in_result: true,
			};
			resize_matrix.call(info);
			return info;
		},
		methods: {
			reset: function() {
				this.row_count = 2;
				this.column_count = 2;
				this.matrix = [];
				this.resize_matrix();
				this.echelon_matrix = false;
				this.determinant = false;
				this.fractions_in_result = true;
			},

			on_matrix_change: function () {
				if (/^\d+$/.test(this.row_count + '') && /^\d+$/.test(this.column_count + '')) {
					this.turn_matrix_echelon_matrix();
					this.compute_matrix_determinant();
				} else {
					this.reset();
				}
			},

			resize_matrix: function () {
				resize_matrix.call(this);
				this.on_matrix_change();
			},

			add_row: function() {
				this.row_count++;
				this.resize_matrix();
			},

			remove_row: function() {
				if (this.row_count > 1) {
					this.row_count--;
					this.resize_matrix();
				}
			},

			add_column: function() {
				this.column_count++;
				this.resize_matrix();
			},

			remove_column: function() {
				if (this.column_count > 1) {
					this.column_count--;
					this.resize_matrix();
				}
			},

			compute_matrix_determinant: function () {
				if (this.row_count == this.column_count) {
					var matrix = parse_matrix(this.matrix, this.row_count, this.column_count);
					if (matrix !== false) {
						var determinant = matrix_determinant(matrix, this.row_count, this.column_count);
						if (this.fractions_in_result) {
							if (determinant.denominator.eq(1)) {
								this.determinant = determinant.numerator.toString();
							} else {
								this.determinant = determinant.numerator.toString() + ' / ' + determinant.denominator.toString();
							}
						} else {
							this.determinant = determinant.numerator.div(determinant.denominator).toString();
						}
					} else {
						this.determinant = false;
					}
				} else {
					this.determinant = false;
				}
			},

			turn_matrix_echelon_matrix: function () {
				var echelon_matrix = parse_matrix(this.matrix, this.row_count, this.column_count);
				if (echelon_matrix !== false) {
					turn_matrix_echelon_matrix(echelon_matrix, this.row_count, this.column_count);
					for (var i = 0; i < echelon_matrix.length; i++) {
						for (var j = 0; j < echelon_matrix[i].length; j++) {
							if (this.fractions_in_result) {
								if (echelon_matrix[i][j].denominator.eq(1)) {
									echelon_matrix[i][j] = echelon_matrix[i][j].numerator.toString();
								} else {
									echelon_matrix[i][j] = echelon_matrix[i][j].numerator.toString() + ' / ' + echelon_matrix[i][j].denominator.toString();
								}
							} else {
								echelon_matrix[i][j] = echelon_matrix[i][j].numerator.div(echelon_matrix[i][j].denominator).toString();
							}
						}
					}
				}
				this.echelon_matrix = echelon_matrix;
			}
		}
	});
});
