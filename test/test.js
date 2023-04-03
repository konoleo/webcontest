const filterKanji = (object, condition, option) => {
	const res = {};
	Object.entries(object).filter(([kanji, value]) => {
		const [condKey, condValue] = Object.entries(condition)[0];
		if (value[condKey] === condValue || Array.isArray(condValue) && condValue.includes(value[condKey])) {
			res[kanji] = value;
		}
	});
	switch (option) {
		case "keys":
			return Object.keys(res);
		case "values":
			return Object.values(res);
		default:
			return res;
	}
};

const getChecked = (elems) => {
	const values = [];
	for (const elem of elems) {
		if (elem.checked) {
			if (isNaN(elem.value)) {
				values.push(elem.value);
			} else {
				values.push(Number(elem.value));
			}
		}
	}
	return values;
};

const addOrdNumWords = (num) => {
	const onesPlace = num % 10;
	const tensPlace = num % 100;
	switch (tensPlace) {
		case 11:
		case 12:
		case 13:
			return `${num}th`;
		default:
			switch (onesPlace) {
				case 1:
					return `${num}st`;
				case 2:
					return `${num}nd`;
				case 3:
					return `${num}rd`;
				default:
					return `${num}th`;
			}
	}
};

const multilingual = (texts) => {
	return texts[pageLang];
};

const addNensei = (grade) => {
	return multilingual({
		"ja": `${grade}年生`,
		"en": `${addOrdNumWords(grade)} grade`
	});
};

const shuffle = (array) => {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1)); // 0 から i のランダムなインデックス
		[array[i], array[j]] = [array[j], array[i]]; // 要素を入れ替える
	}
	return array;
};

const sliceByNum = (array, num) => {
	const blankArray = new Array(Math.ceil(array.length / num)).fill([]);
	return blankArray.map((_, i) => array.slice(num * i, num * (i + 1)));
};

const removeNewline = (html) => html.replace(/[\n\t]/g, "");

fetch("../data/kanjidata.json").then(res => {
	if (res.ok) {
		return res.json();
	} else {
		return Promise.reject(new Error("Failed to fetch a json file."));
	}
}).then(json => {
	const newJson = {};
	Object.entries(json).forEach(([kanji, data]) => {
		if (data.hasOwnProperty("studies")) {
			// 複数年で学習される漢字の場合
			data.studies.forEach(study => {
				study.strokesNum = data.strokesNum;
				study.readingForSort = data.readingForSort;
				newJson[`${kanji}${study.reading ? `（${study.reading}）` : ""}`] = study;
			});
		} else {
			if (data.isUniqueReading === true && data.noNeedToSplit !== true) {
				// 特別な読み方の場合
				const newQuestionsAll = [];
				data.questions.forEach(question => {
					const ansObjIndex = question.phrase.findIndex(text => text.hasOwnProperty("answer"));
					const ansObj = question.phrase[ansObjIndex];
					const kanjis = [...ansObj.answer.matchAll(/\p{sc=Han}/gu)];
					const newQuestions = kanjis.map(kanjiInAns => {
						const newQuestion = structuredClone(question);
						const newAns = [];
						if (kanjiInAns.index !== 0) {
							// 答えの前の文字列
							newAns.push(ansObj.answer.slice(0, kanjiInAns.index));
						}
						newAns.push({"answer": kanjiInAns[0]});
						if (kanjiInAns.index + 1 !== ansObj.answer.length) {
							// 答えの後の文字列
							newAns.push(ansObj.answer.slice(kanjiInAns.index + 1));
						}
						newQuestion.phrase[ansObjIndex].answer = newAns;
						return newQuestion;
					});
					newQuestionsAll.push(...newQuestions);
				});
				data.questions = newQuestionsAll;
			}
			newJson[kanji] = data;
		}
	});
	return newJson;
}).then(json => {
	Object.values(json).forEach(data => {
		if (data.hasOwnProperty("annotation")) {
			// 注釈を各questionに追加
			data.questions.forEach(question => {
				question.annotation = data.annotation;
			});
			delete data.annotation;
		}
	});
	return json;
}).then(json => {
	const fragment = new DocumentFragment();
	let hasMadeQuiz = false;

	// 全ての学習年をデータから取得
	const allGrades = [...new Set(Object.values(json).map(data => data.grade))].sort((a, b) => a - b);

	// 学習年の選択肢を作成
	const gradeOptTemp = document.getElementById("gradeOptTemp");
	allGrades.forEach(grade => {
		const clone = gradeOptTemp.content.cloneNode(true);
		const checkbox = clone.querySelector(".gradeOpt");
		checkbox.value = grade;
		checkbox.insertAdjacentText("afterend", addNensei(grade));
		fragment.appendChild(clone);
	});
	document.getElementById("gradeOpts").appendChild(fragment);

	// 学習年を選び直した時
	const randomQNum = document.getElementById("randomQNum");
	const gradeOptElems = document.getElementsByClassName("gradeOpt");
	// 「ランダムに選択」ボタンの問題数の最大値を設定
	const setMaxValue = () => {
		const selectedGrades = getChecked(gradeOptElems);
		randomQNum.max = filterKanji(json, {"grade": selectedGrades}, "keys").length;
		if (randomQNum.value === "0") {
			randomQNum.value = 40;
		}
		if (Number(randomQNum.value) > Number(randomQNum.max)) {
			randomQNum.value = randomQNum.max;
		}
	};
	setMaxValue();
	for (const gradeOpt of gradeOptElems) {
		gradeOpt.addEventListener("change", () => {
			// 「ランダムに選択」ボタンの最大値変更
			setMaxValue();
			// gradeDetails表示切り替え
			const selectedGrades = getChecked(gradeOptElems);
			allGrades.forEach(grade => {
				document.querySelector(`#gradeDetails${grade}`).hidden = !selectedGrades.includes(grade);
			});
			// テストを更新
			if (hasMadeQuiz) {
				updateQuiz();
			}
		});
	}

	// 「漢字を選択」タブ内
	// 漢字の選択肢
	const gradeDetailsTemp = document.getElementById("gradeDetailsTemp");
	const strokesNumGroupTemp = document.getElementById("strokesNumGroupTemp");
	const kanjiChoiceTemp = document.getElementById("kanjiChoiceTemp");
	allGrades.forEach(grade => {
		const detailsClone = gradeDetailsTemp.content.cloneNode(true);
		const detailsElem = detailsClone.querySelector("details");
		detailsElem.id = `gradeDetails${grade}`;
		detailsClone.querySelector("h2").textContent = addNensei(grade);

		// 「全て選択」ボタン
		const selectAllInput = detailsClone.querySelector(".selectAll");
		selectAllInput.addEventListener("change", () => {
			const isSelect = selectAllInput.checked;
			detailsElem.querySelectorAll(".kanjiChoice").forEach(choice => {
				choice.checked = !isSelect;
				choice.dispatchEvent(new Event("change"));
			});
			selectAllInput.nextSibling.textContent = multilingual(
				isSelect ?
				{"ja": "全て選択", "en": "Select all"} :
				{"ja": "全て選択解除", "en": "Deselect all"}
			);
			// テストを更新
			if (hasMadeQuiz) {
				updateQuiz();
			}
		});

		// 画数ごと
		const filteredByGrade = filterKanji(json, {"grade": grade});
		const strokesNums = [...new Set(Object.values(filteredByGrade).map(value => value.strokesNum))].sort((a, b) => a - b);
		strokesNums.forEach(strokesNum => {
			const strokeClone = strokesNumGroupTemp.content.cloneNode(true);
			strokeClone.querySelector("h3").textContent = multilingual(
				strokesNum === undefined ?
				{"ja": "特別な読み方", "en": "Unique readings"} :
				{"ja": `${strokesNum}画`, "en": `${strokesNum} stroke${strokesNum !== 1 ? "s" : ""}`}
			);
			const filteredByStroke = filterKanji(filteredByGrade,
				strokesNum === undefined ?
				{"isUniqueReading": true} :
				{"strokesNum": strokesNum},
				"keys"
			).sort((a, b) => json[a].readingForSort.localeCompare(json[b].readingForSort, "ja"));
			const choicesDiv = strokeClone.querySelector(".kanjiChoicesDiv");
			// 選択肢追加
			filteredByStroke.forEach(kanji => {
				const choiceClone = kanjiChoiceTemp.content.cloneNode(true);
				const choiceElem = choiceClone.querySelector(".kanjiChoice");
				choiceElem.value = kanji;
				choiceElem.insertAdjacentText("afterend", kanji);
				choicesDiv.appendChild(choiceClone);
			});
			detailsElem.appendChild(strokeClone);
		});
		fragment.appendChild(detailsClone);
	});
	gradeDetailsTemp.parentElement.appendChild(fragment);

	gradeOptElems[0].dispatchEvent(new Event("change"));

	// ランダムに何問選択
	const selectRandomlyBtn = document.getElementById("selectRandomlyBtn");
	const selectRandomly = () => {
		for (const choice of document.querySelectorAll(".kanjiChoice:checked")) {
			choice.checked = false;
			choice.dispatchEvent(new Event("change"));
		}
		const choices = document.querySelectorAll(".gradeDetails:not([hidden]) .kanjiChoice");
		for (const choice of shuffle(Array.from(choices)).slice(0, randomQNum.value)) {
			choice.checked = true;
			choice.dispatchEvent(new Event("change"));
		}
		// テストを更新
		if (hasMadeQuiz) {
			updateQuiz();
		}
	};
	selectRandomlyBtn.addEventListener("click", selectRandomly);
	randomQNum.addEventListener("focus", () => {
		selectRandomlyBtn.removeEventListener("click", selectRandomly);
	});
	randomQNum.addEventListener("blur", () => {
		selectRandomlyBtn.addEventListener("click", selectRandomly);
	});
	randomQNum.addEventListener("change", selectRandomly);

	// 漢字を選び直した時
	const kanjiChoiceElems = document.getElementsByClassName("kanjiChoice");
	const qCounterInPanel = document.getElementById("qCounter");
	for (const choice of kanjiChoiceElems) {
		choice.addEventListener("change", () => {
			if (choice.checked) {
				choice.parentElement.classList.add("checked");
			} else {
				choice.parentElement.classList.remove("checked");
			}
			// カウンター変更
			const selectedNum = getChecked(kanjiChoiceElems).length;
			const sheetsNum = selectedNum === 0 ? 0 : Math.ceil((selectedNum - 16) / 24) + 1;
			qCounterInPanel.textContent = multilingual({
				"ja": `${selectedNum}問（A4 ${sheetsNum}枚）`,
				"en": `${selectedNum} question${selectedNum === 1 ? "" : "s"}（${sheetsNum} A4 sheet${sheetsNum === 1 ? "" : "s"}）`
			});
		});
		choice.addEventListener("click", () => {
			// 手動時 テストを更新
			if (hasMadeQuiz) {
				updateQuiz();
			}
		});
	}

	// パネルにボタン追加
	const originalBtns = document.getElementById("originalBtns");
	for (const btn of originalBtns.children) {
		const btnClone = btn.cloneNode(true);
		btnClone.id = `${btn.id}Clone`;
		btnClone.addEventListener("click", () => {
			btn.click();
		});
		fragment.appendChild(btnClone);
	}
	document.getElementById("copiedBtns").appendChild(fragment);

	// パネルの表示切り替え
	const panel = document.getElementById("panel");
	window.addEventListener("scroll", () => {
		panel.hidden = originalBtns.getBoundingClientRect().top < window.innerHeight;
	});

	// テストを作る
	const makeQuizBtn = document.getElementById("makeQuizBtn");
	const printQuizBtn = document.getElementById("printQuizBtn");
	const printAnsBtn = document.getElementById("printAnsBtn");
	const quizSection = document.getElementById("quizSection");
	const quizPrint = document.getElementById("quizPrint");
	const kanjiHiraElems = document.getElementsByClassName("kanjiHira");
	const qRowsElem = document.getElementById("qRows");
	const qRow = document.getElementsByClassName("qRow");
	const qTemps = {
		"okurigana": document.getElementById("okuriganaTemp"),
		"tango": document.getElementById("tangoTemp")
	};
	const quizDesc = document.getElementById("quizDesc");
	quizDesc.innerHTML = removeNewline(quizDesc.innerHTML);
	const maxScore = document.getElementById("maxScore");
	makeQuizBtn.addEventListener("click", () => {
		updateQuiz();
	});
	const addAnnotation = (annotation) => {
		switch (annotation.type) {
			case "isnot":
				return `「${annotation.value}」ではない`;
		}
	};
	function updateQuiz() {
		// テストの種類をタブから判定
		const quizType = document.querySelector("#tab01 .tabContents .tabWrapper.activeContent").id.replace("Tab", "");

		// テストが作れるか判定
		const [selected, selectedMaxGrade] = (() => {
			try {
				switch (quizType) {
					case "grade":
						const selectedGrades = getChecked(gradeOptElems);
						if (selectedGrades.length === 0) {
							alert(multilingual({"ja": "学習年を一つ以上選択してください。", "en": "Please select one or more study grades."}));
							throw new Error("Not selected");
						} else {
							return [selectedGrades, Math.max(...selectedGrades)];
						};
					case "select":
						const selectedKanji = getChecked(kanjiChoiceElems);
						if (selectedKanji.length === 0) {
							alert(multilingual({"ja": "漢字を一つ以上選択してください。", "en": "Please select one or more Kanji."}));
							throw new Error("Not selected");
						} else {
							return [selectedKanji, Math.max(...selectedKanji.map(kanji => json[kanji].grade))];
						};
				}
			} catch (error) {
				return [null, null];
			}
		})();
		if (selected === null) return false;

		// テスト内の漢字を学年に合わせる
		for (const kanjiHiraElem of kanjiHiraElems) {
			const gradeAttrs = Array.from(kanjiHiraElem.children).map(elem => [elem.dataset.grade, elem]);
			gradeAttrs.forEach(([attr, elem]) => {
				const [start, end] = attr.split("-").map(num => num === "" ? "" : Number(num));
				elem.hidden = !(() => {
					if (attr.match("-")) {
						if (end === "") {
							return start <= selectedMaxGrade;
						} else {
							return start <= selectedMaxGrade && selectedMaxGrade <= end;
						}
					} else {
						return start === selectedMaxGrade;
					}
				})();
			});
		}

		// 漢字を決定
		const kanjiToUse = (() => {
			switch (quizType) {
				case "select":
					return shuffle(selected);
				case "grade":
					return shuffle(filterKanji(json, {"grade": selected}, "keys"));
			}
		})();

		// 問題数を取得
		const qNum = kanjiToUse.length;
		maxScore.textContent = qNum;

		// 今の問題を削除
		while (qRow[0]) {
			qRow[0].remove();
		}

		// 問題を追加
		const slicedKanji = sliceByNum(kanjiToUse, 8);
		slicedKanji.forEach(kanjis => {
			const div = document.createElement("div");
			div.classList.add("qRow");
			kanjis.forEach(kanji => {
				const questions = json[kanji].questions;
				const question = questions[Math.floor(Math.random() * questions.length)];
				const qType = question.hasOkurigana ? "okurigana" : "tango";
				const clone = qTemps[qType].content.cloneNode(true);
				const phraseElem = clone.querySelector(".phrase");
				const nodesToAdd = question.phrase.map((text, i) => {
					if (text.hasOwnProperty("answer")) {
						const readingElem = clone.querySelector(".reading");
						readingElem.textContent = text.reading;
						const ansElem = clone.querySelector(".answer");
						if (qType === "okurigana") {
							ansElem.textContent = text.answer;
							if (text.answer.length >= 5) {
								// 答えが5文字以上の場合
								ansElem.classList.add("long");
							}
							return readingElem;
						} else {
							const mainElem = clone.querySelector(".main");
							if (i === 0) {
								mainElem.classList.add("firstNode")
							}
							if (Array.isArray(text.answer)) {
								// 特別な読みの場合
								mainElem.classList.add("unique");
								const blankElem = clone.querySelector(".blank");
								const ansNodeToAdd = text.answer.map((ans, k) => {
									if (ans.hasOwnProperty("answer")) {
										if (k === 0) {
											blankElem.classList.add("firstNode")
										}
										ansElem.textContent = ans.answer;
										return blankElem;
									} else {
										return ans;
									}
								});
								mainElem.append(...ansNodeToAdd);
								const ansLength = text.answer.reduce((prev, curr) => prev + (typeof curr === "object" ? curr.answer.length : curr.length), 0);
								if (text.reading.length <= ansLength) {
									// 読みが答えより短い/同じ場合
									readingElem.classList.add("short");
								} else if (text.reading.length === ansLength + 1) {
									// 読みが答えより1文字長い場合
									readingElem.classList.add("long1");
								} else if (text.reading.length >= ansLength + 3) {
									// 読みが答えより3文字以上長い場合
									readingElem.classList.add("long2");
								}
							} else {
								ansElem.textContent = text.answer;
								if (text.reading.length >= 3) {
									// 読み3文字以上の場合
									readingElem.classList.add("long");
								}
							}
							return mainElem;
						}
					} else if (text.hasOwnProperty("furigana")) {
						const rubyElem = document.createElement("span");
						rubyElem.classList.add("ruby");
						rubyElem.textContent = text.text;
						rubyElem.dataset.ruby = text.furigana;
						return rubyElem;
					} else {
						return text;
					}
				});
				phraseElem.append(...nodesToAdd);
				if (question.hasOwnProperty("annotation")) {
					const annotationElem = document.createElement("span");
					annotationElem.classList.add("annotation");
					annotationElem.textContent = `※${addAnnotation(question.annotation)}`;
					clone.querySelector(".question").appendChild(annotationElem);
				}
				div.appendChild(clone);
			});
			fragment.appendChild(div);
		});
		qRowsElem.appendChild(fragment);

		if (hasMadeQuiz === false) {
			// 最初にテストを作る時
			hasMadeQuiz = true;
			quizSection.removeAttribute("hidden");
			[printQuizBtn, printAnsBtn].forEach(btn => {
				btn.removeAttribute("hidden");
				document.getElementById(`${btn.id}Clone`).removeAttribute("hidden");
			});
			const newText = multilingual({"ja": "問題を更新", "en": "Update questions"});
			makeQuizBtn.textContent = newText;
			document.getElementById("makeQuizBtnClone").textContent = newText;
		}

		// 幅・高さを変更
		changeScaleOfPrint();
	};

	// 答えの表示切り替え
	const showAnsBtn = document.getElementById("showAnsBtn");
	showAnsBtn.addEventListener("change", () => {
		if (showAnsBtn.checked) {
			quizPrint.classList.add("showingAns");
		} else {
			quizPrint.classList.remove("showingAns");
		}
	});

	// 幅・高さを変更
	window.addEventListener("resize", changeScaleOfPrint);
	function changeScaleOfPrint() {
		const scale = quizSection.offsetWidth / quizPrint.offsetWidth;
		quizPrint.style.setProperty("--scale", scale);
		let height = 0;
		for (const sibling of quizSection.children) {
			if (sibling !== quizPrint) {
				height += sibling.offsetHeight;
			}
		}
		quizSection.style.height = quizPrint.offsetHeight * quizPrint.style.getPropertyValue("--scale") + height + "px";
	}

	// 印刷時
	const printQuiz = (e) => {
		const original = showAnsBtn.checked;
		showAnsBtn.checked = e.currentTarget.id === "printAnsBtn";
		showAnsBtn.dispatchEvent(new Event("change"));
		window.print();
		showAnsBtn.checked = original;
		showAnsBtn.dispatchEvent(new Event("change"));
	};
	printQuizBtn.addEventListener("click", printQuiz);
	printAnsBtn.addEventListener("click", printQuiz);
	window.addEventListener("beforeprint", () => {
		const printArea = document.createElement("div");
		printArea.id = "printArea";
		document.body.appendChild(printArea);
		printArea.appendChild(quizPrint.cloneNode(true));
		document.body.firstElementChild.setAttribute("hidden", "");
	});
	window.addEventListener("afterprint", () => {
		const elem = document.body.firstElementChild;
		if (elem.hidden === true) {
			elem.hidden = false;
			document.getElementById("printArea").remove();
		}
	});
});