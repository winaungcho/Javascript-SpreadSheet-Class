
/******
 * Javascript SpreadSheetClass
 *
 * Single click/touch to select cell
 * Double Click/touch on cell to edit content
 * Edit data of selected cell in input at the top of table
 * Formular can be evaluated and Cell address can be used
 * Equation '=B2+A2*2+sin(0.967)*12' is valid one.
 * '=sin(pi/6)*B2'
 * This class is free for the educational use as long as maintain this header together with this class.
 * Author: Win Aung Cho
 * Contact winaungcho@gmail.com
 * version 1.0
 * Date: 22-10-2020
 *
 ******/
class SpreadSheet {
		constructor() {
			this.Formula = new Object();
			//this.table;
			//this.cellv;
		}
		addTable(rows, cols) {
			var myTableDiv = document.getElementById("dyntable");
			var mytable = this;
			this.cellv = document.createElement('INPUT');
			this.cellv.style = "width:100%;";
			this.cellv.id = "cellv";
			myTableDiv.parentNode.insertBefore(this.cellv, myTableDiv);
			this.cellv.addEventListener("keyup", function(event) {
				if(event.keyCode === 13) {
					mytable.commitcellv(mytable.cellv.value);
				}
			});
			this.cellv.onblur = function() {
				mytable.commitcellv(mytable.cellv.value);
			}
			this.table = document.createElement('TABLE');
			this.table.border = '1px';
			this.table.id = "empTable";
			var tableBody = document.createElement('TBODY');
			this.table.appendChild(tableBody);
			for(var i = 0; i < rows; i++) {
				var tr = document.createElement('TR');
				var td;
				tableBody.appendChild(tr);
				for(var j = 0; j < cols; j++) {
					if(i == 0) td = document.createElement('TH');
					else td = document.createElement('TD');
					//mytable = this;
					if(i !== 0 && j !== 0) {
						td.onclick = function() {
							if(this.contentEditable === "true") {
								if(mytable.Formula[this.id] !== undefined) {
									mytable.cellv.value = mytable.Formula[this.id];
									this.innerHTML = mytable.Formula[this.id];
								} else mytable.cellv.value = this.innerHTML;
							} else {
								if(mytable.Formula[this.id] !== undefined) mytable.cellv.value = mytable.Formula[this.id];
								else mytable.cellv.value = this.innerHTML;
								var Non = document.getElementsByClassName("selected");
								for(var k = 0; k < Non.length; k++) {
									Non[k].className = "";
								}
								this.className = "selected";
								//mytable.cellv.focus();
							}
						}
					} else if(i === 0) {
					    // header Click
						
					}
					td.onblur = function() {
						if(this.contentEditable === "true") {
							var value = this.innerHTML;
							mytable.setstring(this, value);
						}
					}
					td.ondblclick = function() {
						if(i !== 0 && j !== 0) {
							var Non = document.getElementsByClassName("selected");
							for(var k = 0; k < Non.length; k++) {
								Non[k].className = "";
							}
							this.contentEditable = "true";
							this.focus();
						}
					}
					var letter = String.fromCharCode("A".charCodeAt(0) + j - 1);
					var celltext = i && j ? "" : i || letter;
					td.id = letter + i;
					if(celltext !== "") td.appendChild(document.createTextNode(celltext));
					tr.appendChild(td);
				}
			}
			myTableDiv.appendChild(this.table);
		}
		setstring(td, str) {
			td.innerHTML = str;
			if(str.charAt(0) == "=") {
				this.Formula[td.id] = str;
			}
			this.calcTableData(this.table);
			this.cellv.value = "";
			td.contentEditable = "false";
		}
		commitcellv(str) {
			var Non = document.getElementsByClassName("selected");
			//alert(str);
			this.setstring(Non[0], str);
			for(var k = 0; k < Non.length; k++) {
				Non[k].className = "";
			}
		}
		calcTableData(myTab) {
			//var myTab = document.getElementById('empTable');
			var M = myTab.rows.length;
			var cell, i, j;
			var value;
		
			for(i = 0; i < M; i++) {
				var objCells = myTab.rows.item(i).cells;
				var N = objCells.length;
				//	alert(M+":"+N);
				for(j = 0; j < N; j++) {
					cell = objCells.item(j); //.innerHTML;
					value = (this.Formula[cell.id] !== undefined) ? this.Formula[cell.id] : cell.innerHTML;
					if((i && j) && value !== "") {
						if(value.charAt(0) == "=") {
							this.Formula[cell.id] = value;
							value = value.replace(/sin/ig, "Math.sin");
							value = value.replace(/cos/ig, "Math.cos");
							value = value.replace(/sqrt/ig, "Math.sqrt");
							value = value.replace(/pi/ig, "Math.PI");
							//value = value.replace(/^/ig,"Math.PI");
							//cell.innerHTML = eval(cell.id + "=" + value.substring(1));
							try {
								cell.innerHTML = (0, eval)(("" + cell.id + "=" + value.substring(1)).toString());
							} catch(e) {
								if(e instanceof SyntaxError) {
									alert(i + "," + j + ":" + e.message);
								}
							}
							cell.align = "right";
						} else {
							if(!isNaN(Number(value))) {
								//alert(cell.id+"="+value);
								//eval(cell.id + "=" + value);
								try {
									(0, eval)("" + cell.id + "=" + value);
								} catch(e) {
									if(e instanceof SyntaxError) {
										alert(i + "," + j + ":" + e.message);
									}
								}
								this.Formula[cell.id] = undefined;
								cell.align = "right";
							} else
							if(this.Formula[cell.id] !== undefined) {
								this.Formula[cell.id] = undefined;
								//eval(cell.id + "=0");
								try {
									(0, eval)("" + cell.id + "= 0.0");
								} catch(e) {
									if(e instanceof SyntaxError) {
										alert(i + "," + j + ":" + e.message);
									}
								}
								cell.align = "left";
							}
						}
					} else
					if((i && j) && value === "") {
						//alert(cell.id+" caltable "+i+","+j+':'+value);
						try {
							(0, eval)("" + cell.id + "= 0.0");
						} catch(e) {
							if(e instanceof SyntaxError) {
								alert(i + "," + j + ":" + e.message);
							}
						}
						this.Formula[cell.id] = undefined;
						cell.align = "left";
					}
				}
			}
		}
	}