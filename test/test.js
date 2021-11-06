window.addEventListener("load", () => {
	fetch("../data/kanjidata.json").then(response => {
		if (response.ok) {
			return response.json();
		} else {
			return Promise.reject(new Error("JSONファイルにアクセスできません。"));
		}
	}).then((kanjiData) => {
		// データのチェック
		// const okurigana = [];
		// const tango = [];
		// Object.keys(kanjiData).forEach(element => {
		// 	kanjiData[element].test.forEach(item => {
		// 		if (item.hasOkurigana === true) {
		// 			okurigana.push(item);
		// 		} else {
		// 			tango.push(item);
		// 		}
		// 	});
		// });
		// const problemOkurigana = [];
		// const problemHiragana = [];
		// const problemAnswercount = [];
		// const problemCharactercount = [];
		// const problemYet = [];
		// const kanji456 = ["愛", "案", "以", "衣", "位", "囲", "胃", "印", "英", "栄", "塩", "億", "加", "果", "貨", "課", "芽", "改", "械", "害", "街", "各", "覚", "完", "官", "管", "関", "観", "願", "希", "季", "紀", "喜", "旗", "器", "機", "議", "求", "泣", "救", "給", "挙", "漁", "共", "協", "鏡", "競", "極", "訓", "軍", "郡", "径", "型", "景", "芸", "欠", "結", "建", "健", "験", "固", "功", "好", "候", "航", "康", "告", "差", "菜", "最", "材", "昨", "札", "刷", "殺", "察", "参", "産", "散", "残", "士", "氏", "史", "司", "試", "児", "治", "辞", "失", "借", "種", "周", "祝", "順", "初", "松", "笑", "唱", "焼", "象", "照", "賞", "臣", "信", "成", "省", "清", "静", "席", "積", "折", "節", "説", "浅", "戦", "選", "然", "争", "倉", "巣", "束", "側", "続", "卒", "孫", "帯", "隊", "達", "単", "置", "仲", "貯", "兆", "腸", "低", "底", "停", "的", "典", "伝", "徒", "努", "灯", "堂", "働", "特", "得", "毒", "熱", "念", "敗", "梅", "博", "飯", "飛", "費", "必", "票", "標", "不", "夫", "付", "府", "副", "粉", "兵", "別", "辺", "変", "便", "包", "法", "望", "牧", "末", "満", "未", "脈", "民", "無", "約", "勇", "要", "養", "浴", "利", "陸", "良", "料", "量", "輪", "類", "令", "冷", "例", "歴", "連", "老", "労", "録", "圧", "移", "因", "永", "営", "衛", "易", "益", "液", "演", "応", "往", "桜", "恩", "可", "仮", "価", "河", "過", "賀", "快", "解", "格", "確", "額", "刊", "幹", "慣", "眼", "基", "寄", "規", "技", "義", "逆", "久", "旧", "居", "許", "境", "均", "禁", "句", "群", "経", "潔", "件", "券", "険", "検", "限", "現", "減", "故", "個", "護", "効", "厚", "耕", "鉱", "構", "興", "講", "混", "査", "再", "災", "妻", "採", "際", "在", "財", "罪", "雑", "酸", "賛", "支", "志", "枝", "師", "資", "飼", "示", "似", "識", "質", "舎", "謝", "授", "修", "述", "術", "準", "序", "招", "承", "証", "条", "状", "常", "情", "織", "職", "制", "性", "政", "勢", "精", "製", "税", "責", "績", "接", "設", "舌", "絶", "銭", "祖", "素", "総", "造", "像", "増", "則", "測", "属", "率", "損", "退", "貸", "態", "団", "断", "築", "張", "提", "程", "適", "敵", "統", "銅", "導", "徳", "独", "任", "燃", "能", "破", "犯", "判", "版", "比", "肥", "非", "備", "俵", "評", "貧", "布", "婦", "富", "武", "復", "複", "仏", "編", "弁", "保", "墓", "報", "豊", "防", "貿", "暴", "務", "夢", "迷", "綿", "輸", "余", "預", "容", "略", "留", "領", "異", "遺", "域", "宇", "映", "延", "沿", "我", "灰", "拡", "革", "閣", "割", "株", "干", "巻", "看", "簡", "危", "机", "揮", "貴", "疑", "吸", "供", "胸", "郷", "勤", "筋", "系", "敬", "警", "劇", "激", "穴", "絹", "権", "憲", "源", "厳", "己", "呼", "誤", "后", "孝", "皇", "紅", "降", "鋼", "刻", "穀", "骨", "困", "砂", "座", "済", "裁", "策", "冊", "蚕", "至", "私", "姿", "視", "詞", "誌", "磁", "射", "捨", "尺", "若", "樹", "収", "宗", "就", "衆", "従", "縦", "縮", "熟", "純", "処", "署", "諸", "除", "将", "傷", "障", "城", "蒸", "針", "仁", "垂", "推", "寸", "盛", "聖", "誠", "宣", "専", "泉", "洗", "染", "善", "奏", "窓", "創", "装", "層", "操", "蔵", "臓", "存", "尊", "宅", "担", "探", "誕", "段", "暖", "値", "宙", "忠", "著", "庁", "頂", "潮", "賃", "痛", "展", "討", "党", "糖", "届", "難", "乳", "認", "納", "脳", "派", "拝", "背", "肺", "俳", "班", "晩", "否", "批", "秘", "腹", "奮", "並", "陛", "閉", "片", "補", "暮", "宝", "訪", "亡", "忘", "棒", "枚", "幕", "密", "盟", "模", "訳", "郵", "優", "幼", "欲", "翌", "乱", "卵", "覧", "裏", "律", "臨", "朗", "論"];
		// okurigana.forEach(element => {
		// 	var count = "";
		// 	var answer;
		// 	element.phrase.forEach(item => {
		// 		if (item.answer) {
		// 			if (!/^[一-齢][ぁ-んー]+$/.test(item.answer)) {
		// 				problemOkurigana.push(item);
		// 			}
		// 			answer = item.answer[0];
		// 		}
		// 		count += item.text;
		// 	});
		// 	const kanji = count.match(/[一-齢]/g);
		// 	if (kanji) {
		// 		const moreNums = [1, 2, 3].filter(num => num >= kanjiData[answer].studyYear);
		// 		const moreYearsKanji = filterByYear(moreNums).concat(kanji456);
		// 		kanji.forEach(aKanji => {
		// 			if (moreYearsKanji.includes(aKanji)) {
		// 				problemYet.push(element.phrase);
		// 			}
		// 		});
		// 	}
		// 	if (count.length >= 8) {
		// 		problemCharactercount.push(element.phrase);
		// 	}
		// });
		// tango.forEach(element => {
		// 	var count = "";
		// 	var answer;
		// 	element.phrase.forEach(item => {
		// 		if (item.answer) {
		// 			if (/[ぁ-んー]/.test(item.answer)) {
		// 				problemHiragana.push(item);
		// 			}
		// 			if (item.answer.length !== 1) {
		// 				problemAnswercount.push(item);
		// 			}
		// 			answer = item.answer[0];
		// 		} else {
		// 			count += item.text;
		// 		}
		// 	});
		// 	const kanji = count.match(/[一-齢]/g);
		// 	if (kanji) {
		// 		const moreNums = [1, 2, 3].filter(num => num >= kanjiData[answer].studyYear);
		// 		const moreYearsKanji = filterByYear(moreNums).concat(kanji456);
		// 		kanji.forEach(aKanji => {
		// 			if (moreYearsKanji.includes(aKanji)) {
		// 				problemYet.push(element.phrase);
		// 			}
		// 		});
		// 	}
		// 	if (count.length >= 5) {
		// 		problemCharactercount.push(element.phrase);
		// 	}
		// });
		// const problems = [
		// 	{problem: problemOkurigana, text: "送り仮名がない問題"},
		// 	{problem: problemHiragana, text: "ひらがなが入っている問題"},
		// 	{problem: problemAnswercount, text: "答えが2文字以上ある問題"},
		// 	{problem: problemCharactercount, text: "文字が多い問題"},
		// 	{problem: problemYet, text: "まだ習っていないかもしれない漢字がある問題"},
		// ];
		// problems.forEach(element => {
		// 	console.log(element.text+":");
		// 	if (element.problem.length) {
		// 		console.log(element.problem);
		// 	} else {
		// 		console.log("ありませんでした");
		// 	}
		// 	console.log("");
		// });

		// 学習年で漢字をフィルター
		function filterByYear(year) {
			const kanjiArr = [];
			Object.keys(kanjiData).forEach(element => {
				if (year.includes(kanjiData[element].studyYear)) {
					kanjiArr.push(element);
				}
			});
			return kanjiArr;
		}

		function shuffle(array) {
			for (let i = (array.length - 1); 0 < i; i--){
				const r = Math.floor(Math.random() * (i + 1));
				const tmp = array[i];
				array[i] = array[r];
				array[r] = tmp;
			}
			return array;
		}

		function ramdomSelect(qNum, year) {
			const kanjiArr = shuffle(filterByYear(year));
			const difference = kanjiArr.length - qNum;
			if (difference > 0) {
				kanjiArr.splice(0, difference);
			}
			return kanjiArr;
		}

		function getMultiple(elems) {
			const values = [];
			for (let i = 0; i < elems.length; i++) {
				if (elems[i].checked) {
					const num = Number(elems[i].value);
					if (Number.isNaN(num)) {
						values.push(elems[i].value);
					} else {
						values.push(Number(elems[i].value));
					}
				}
			}
			return values;
		}

		function ordinalSuffix(i) {
			var j = i % 10,
				k = i % 100;
			if (j == 1 && k != 11) {
				return i + "st";
			}
			if (j == 2 && k != 12) {
				return i + "nd";
			}
			if (j == 3 && k != 13) {
				return i + "rd";
			}
			return i + "th";
		}

		const settingTabs = document.getElementsByName("settingTab");
		const settingTabpanel = document.getElementsByClassName("settingTabpanel");
		const questionsDiv = document.getElementById("questionsDiv");
		const studyYearBtns = document.getElementsByName("studyYear");
		const qNumElem = document.getElementById("qNum");
		const kanjiChoicesElems = document.getElementsByName("kanjiChoices");
		const answerBtn = document.getElementById("answer");
		const makeTestBtn = document.getElementById("makeTest");
		const testAreaElem = document.getElementById("testArea");
		const maxScoreElem = document.getElementById("maxScore");

		// 設定タブの初期設定
		const activeTab = document.getElementById("activeTab");
		activeTab.firstElementChild.setAttribute("checked", "");
		if (activeTab.firstElementChild === settingTabs[0]) {
			settingTabpanel[1].setAttribute("hidden", "");
		} else {
			settingTabpanel[0].setAttribute("hidden", "");
		}
		// 設定タブの動き
		for (let i = 0; i < settingTabs.length; i++) {
			settingTabs[i].addEventListener("click", () => {
				settingTabpanel[i].removeAttribute("hidden");
				settingTabpanel[Math.pow(0,i)].setAttribute("hidden", "");
				settingTabs[i].parentElement.id = "activeTab";
				settingTabs[Math.pow(0,i)].parentElement.removeAttribute("id");
			});
		}

		// 学習年を選び直した時に、選択肢を変える
		function changeChoices() {
			const detailsElems = settingTabpanel[1].getElementsByTagName("details");
			const studyYear = getMultiple(studyYearBtns);
			if (detailsElems.length) {
				studyYear.forEach((year, index) => {
					detailsElems[year-1].removeAttribute("hidden");
					if (index === 0 && detailsElems[year-1].open) {
						detailsElems[year-1].setAttribute("open", "true");
					}
				});
				const otherYears = [1, 2, 3].filter(num => !studyYear.includes(num));
				otherYears.forEach(year => {
					detailsElems[year-1].setAttribute("hidden", "");
				});
			} else {
				// 選択肢を表示
				studyYear.forEach((year, index) => {
					const choices = filterByYear([year]);
					if (choices.length) {
						const details = document.createElement("details");
						if (index === 0) {
							details.setAttribute("open", "true");
						}
						const summary = document.createElement("summary");
						const h3 = document.createElement("h3");
						h3.innerHTML = `
							<span lang="ja">${year}年生</span>
							<span lang="en-US" hidden>${ordinalSuffix(year)} grade</span>
						`;
						summary.appendChild(h3);
						details.appendChild(summary);
						const button = document.createElement("button");
						button.textContent = `${year}年生の漢字をすベて選択`;
						button.innerHTML = `
							<span lang="ja">${year}年生の漢字をすベて選択</span>
							<span lang="en-US" hidden>Select all ${ordinalSuffix(year)} grade Kanji</span>
						`;
						button.setAttribute("id", `all${year}check`);
						details.appendChild(button);
						const div = document.createElement("div");
						div.classList.add("kanjiChoicesDiv");
						details.appendChild(div);
						const temp = document.getElementById("kanjiChoicesTemp");
						choices.forEach(choice => {
							const clone = temp.content.cloneNode(true);
							const labelElem = clone.querySelector("label");
							labelElem.children[0].value = choice;
							let html = labelElem.innerHTML;
							html = html.trim();
							html += choice;
							labelElem.innerHTML = html;
							div.appendChild(clone);
						});
						details.appendChild(div);
						settingTabpanel[1].appendChild(details);
					}
				});
				lang();
			}
		}
		changeChoices();

		["all1check", "all2check", "all3check"].forEach(item => {
			const elem = document.getElementById(item);
			elem.addEventListener("click", () => {
				const inputs = elem.nextElementSibling.getElementsByTagName("input");
				for (let i = 0; i < inputs.length; i++) {
					inputs[i].checked = !elem.classList.contains("checked");
				}
				elem.classList.toggle("checked");
				const message = {
					"ja": ["をすベて選択", "の選択をすべて解除"],
					"en-US": ["Select", "Deselect"],
				};
				if (!elem.classList.contains("checked")) {
					message[userLang].reverse();
				}
				elem.innerHTML = elem.innerHTML.replace(message[userLang][0], message[userLang][1]);
			});
		});

		// テストを作る
		function makeTest() {
			// ランダムか漢字の選択か判定
			const hiddenElem = [...settingTabpanel].filter(elem => elem.hasAttribute("hidden"));
			const kind = hiddenElem[0] === settingTabpanel[1] ? "ramdom" : "select";
			
			// テストが作れるか判定
			const studyYear = getMultiple(studyYearBtns);
			if (!studyYear.length) {
				alert("学習年をひとつ以上選択してください。");
				return;
			}
			if (kind === "select" && !getMultiple(kanjiChoicesElems).length) {
				alert("漢字をひとつ以上選択してください。");
				return;
			}
			
			// テスト部分の表示
			document.getElementById("testH2").removeAttribute("hidden");
			testAreaElem.removeAttribute("hidden");

			// 今ある問題を削除
			while (questionsDiv.firstChild) {
				questionsDiv.firstChild.remove();
			}

			// 漢字を決定
			let qKanji, qNum;
			if (kind === "ramdom") {
				// 問題数を取得
				qNum = Number(qNumElem.value);
				if (qNumElem.max < qNum) {
					qNum = qNumElem.max;
					qNumElem.value = qNum;
				} else if (qNum < qNumElem.min) {
					qNum = qNumElem.min;
					qNumElem.value = qNum;
				}
				// 漢字をランダムに選ぶ
				qKanji = ramdomSelect(qNum, studyYear);
			} else {
				// 選ばれた漢字を取得
				const kanjis = getMultiple(kanjiChoicesElems);
				// 問題数を取得
				qNum = kanjis.length;
				// シャッフル
				qKanji = shuffle(kanjis);
			}
			maxScoreElem.textContent = qNum;

			const temp = document.getElementById("questionTemp");
			qKanji.forEach(kanji => {
				const test = kanjiData[kanji].test;
				const phraseNum = Math.floor(Math.random() * test.length);	// 何番目のフレーズか
				const clone = temp.content.cloneNode(true);
				const questionElem = clone.querySelector(".question");
				const phraseElem = questionElem.getElementsByClassName("phrase")[0];
				if (test[phraseNum].hasOkurigana) {
					// 送りがながある問題のとき
					questionElem.classList.add("okurigana");
					test[phraseNum].phrase.forEach(phrase => {
						if (phrase.answer) {
							// フレーズ
							const yomigana = document.createElement("span");
							yomigana.classList.add("yomigana");
							yomigana.textContent = phrase.text;
							phraseElem.appendChild(yomigana);
							// 四角
							const blankElem = document.createElement("div");
							blankElem.classList.add("blank");
							// 答え
							const answerElem = document.createElement("span");
							answerElem.textContent = phrase.answer;
							answerElem.classList.add("answer");
							if (phrase.answer.length >= 4) {
								answerElem.classList.add("more");
							}
							answerElem.setAttribute("hidden", "");
							blankElem.appendChild(answerElem);
							questionElem.appendChild(blankElem);
						} else {
							phraseElem.innerHTML += phrase.text;
						}
					});
				} else {
					// 単語の問題のとき
					questionElem.classList.add("tango");
					test[phraseNum].phrase.forEach(phrase => {
						if (phrase.answer) {
							// 四角
							const blankElem = document.createElement("div");
							blankElem.classList.add("blank");
							phraseElem.appendChild(blankElem);
							// フレーズ
							const yomigana = document.createElement("span");
							yomigana.classList.add("yomigana");
							if (phrase.text.length >= 3) {
								yomigana.classList.add("more");
							}
							yomigana.textContent = phrase.text;
							blankElem.appendChild(yomigana);
							// 答え
							const answerElem = document.createElement("span");
							answerElem.textContent = phrase.answer;
							answerElem.classList.add("answer");
							answerElem.setAttribute("hidden", "");
							blankElem.appendChild(answerElem);
						} else {
							phraseElem.innerHTML += phrase.text;
						}
					});
				}
				questionsDiv.appendChild(clone);
			});

			// 答えを表示する準備
			showAnswer();

			// テスト内の漢字を学年に合わせる
			const maxYear = Math.max(...studyYear);
			const maxYearElems = document.querySelectorAll(`[data-year="${maxYear}"]`);
			for (let i = 0; i < maxYearElems.length; i++) {
				maxYearElems[i].removeAttribute("hidden");
			}
			const otherYears = [1, 2, 3].filter(num => num !== maxYear);
			for (let i = 0; i < otherYears.length; i++) {
				const otherYearsElems = document.querySelectorAll(`[data-year="${otherYears[i]}"]`);
				for (let y = 0; y < otherYearsElems.length; y++) {
					otherYearsElems[y].setAttribute("hidden", "");
				}
			}
		}

		// 学習年を選び直したとき
		for (let i = 0; i < studyYearBtns.length; i++) {
			studyYearBtns[i].addEventListener("change", () => {
				// 問題数の最大値を漢字の数に合わせる
				const studyYear = getMultiple(studyYearBtns);
				const maxKanjiNum = filterByYear(studyYear).length;
				qNumElem.max = maxKanjiNum;
				if (qNumElem.value === "0") {
					qNumElem.value = 16;
				}
				if (Number(qNumElem.value) > Number(qNumElem.max)) {
					qNumElem.value = qNumElem.max;
				}
				// 漢字の選択肢を変更
				changeChoices();
			});
		}

		// テスト作成
		makeTestBtn.addEventListener("click", () => {
			makeTest();
			if (!testArea.hasAttribute("hidden")) {
				const message = {
					"ja": "テストを更新",
					"en-US": "Update test",
				};
				makeTestBtn.textContent = message[userLang];
			}
		});

		// 印刷
		document.getElementById("printTest").addEventListener("click", () => {
			const printArea = document.createElement("div");
			// 8問ずつグルーピング
			function sliceByNumber(array, number) {
				const elements = [...array];
				const length = Math.ceil(elements.length / number);
				return new Array(length).fill().map((_, i) =>
					elements.slice(i * number, (i + 1) * number)
				);
			}
			sliceByNumber(questionsDiv.children, 8).forEach(elemGroup => {
				const div = document.createElement("div");
				div.classList.add("row");
				elemGroup.forEach(elem => {
					div.appendChild(elem);
				});
				questionsDiv.appendChild(div);
			});
			document.body.appendChild(printArea);
			printArea.appendChild(testAreaElem.cloneNode(true));
			document.body.firstElementChild.setAttribute("hidden", "");
			window.print();
			document.body.firstElementChild.removeAttribute("hidden");
			printArea.remove();
			const rowElem = document.getElementsByClassName("row");
			while (rowElem[0]) {
				while (rowElem[0].firstElementChild) {
					questionsDiv.appendChild(rowElem[0].firstElementChild);
				}
				rowElem[0].remove();
			}
		});

		// 答えを表示
		function showAnswer() {
			const answerElems = document.getElementsByClassName("answer");
			if (answerBtn.checked) {
				for (let i = 0; i < answerElems.length; i++) {
					answerElems[i].removeAttribute("hidden")
				}
			} else {
				for (let i = 0; i < answerElems.length; i++) {
					answerElems[i].setAttribute("hidden", "")
				}
			}
		}
		answerBtn.addEventListener("click", showAnswer);
		showAnswer();

	}).catch(e => {
		console.error(e.message);
	});
});