fetch("../data/kanjidata.json").then(response => {
	if (response.ok) {
		return response.json();
	} else {
		return Promise.reject(new Error("JSONファイルにアクセスできません。"));
	}
}).then((kanjiData) => {
	// const keysArr = Object.keys(kanjiData);
	// const strokeData = {
	// 	1: ["一"],
	// 	2: ["九", "七", "十", "人", "二", "入", "八", "力", "刀", "丁"],
	// 	3: ["下", "口", "三", "山", "子", "女", "小", "上", "夕", "千", "川", "大", "土", "丸", "弓", "工", "才", "万", "士", "久", "干", "己", "寸", "亡"],
	// 	4: ["円", "王", "火", "月", "犬", "五", "手", "水", "中", "天", "日", "木", "文", "六", "引", "牛", "今", "元", "戸", "午", "公", "止", "少", "心", "切", "太", "内", "父", "分", "方", "毛", "友", "区", "化", "反", "予", "欠", "氏", "不", "夫", "井", "支", "比", "仏", "尺", "収", "仁", "片"],
	// 	5: ["玉", "左", "四", "出", "正", "生", "石", "田", "白", "本", "目", "右", "立", "外", "兄", "古", "広", "矢", "市", "台", "冬", "半", "母", "北", "用", "央", "去", "号", "皿", "仕", "写", "主", "申", "世", "他", "打", "代", "皮", "氷", "平", "由", "礼", "以", "加", "功", "札", "司", "失", "必", "付", "辺", "包", "末", "未", "民", "令", "史", "圧", "永", "可", "刊", "旧", "句", "示", "犯", "布", "弁", "穴", "冊", "処", "庁", "幼"],
	// 	6: ["休", "気", "糸", "字", "耳", "先", "早", "竹", "虫", "年", "百", "名", "羽", "会", "回", "交", "光", "考", "行", "合", "寺", "自", "色", "西", "多", "池", "地", "当", "同", "肉", "米", "毎", "安", "曲", "血", "向", "死", "次", "式", "守", "州", "全", "有", "羊", "両", "列", "衣", "印", "各", "共", "好", "成", "争", "仲", "兆", "伝", "灯", "老", "因", "仮", "件", "再", "在", "団", "任", "舌", "宇", "灰", "危", "机", "吸", "后", "至", "存", "宅"],
	// 	7: ["花", "貝", "見", "車", "赤", "足", "村", "男", "町", "何", "角", "汽", "近", "形", "言", "谷", "作", "社", "図", "声", "走", "体", "弟", "売", "麦", "来", "里", "医", "究", "局", "君", "決", "住", "助", "身", "対", "投", "豆", "坂", "返", "役", "位", "改", "完", "希", "求", "芸", "材", "児", "初", "臣", "折", "束", "低", "努", "兵", "別", "利", "良", "冷", "労", "沖", "岐", "佐", "阪", "囲", "告", "応", "快", "技", "均", "災", "志", "似", "序", "状", "条", "判", "防", "余", "我", "系", "孝", "困", "私", "否", "批", "忘", "卵", "乱"],
	// 	8: ["雨", "学", "空", "金", "青", "林", "画", "岩", "京", "国", "姉", "知", "長", "直", "店", "東", "歩", "妹", "明", "門", "夜", "委", "育", "泳", "岸", "苦", "具", "幸", "始", "使", "事", "実", "者", "昔", "取", "受", "所", "注", "定", "波", "板", "表", "服", "物", "放", "味", "命", "油", "和", "英", "果", "芽", "官", "季", "泣", "協", "径", "固", "刷", "参", "治", "周", "松", "卒", "底", "的", "典", "念", "府", "法", "牧", "例", "岡", "奈", "阜", "毒", "易", "往", "価", "河", "居", "効", "妻", "枝", "舎", "述", "招", "性", "制", "版", "肥", "非", "武", "券", "承", "沿", "延", "拡", "供", "呼", "刻", "若", "宗", "垂", "担", "宙", "忠", "届", "乳", "拝", "並", "宝", "枚"],
	// 	9: ["音", "草", "科", "海", "活", "計", "後", "室", "首", "秋", "春", "食", "星", "前", "茶", "昼", "点", "南", "風", "思", "屋", "界", "客", "急", "級", "係", "県", "研", "指", "持", "拾", "重", "昭", "乗", "神", "相", "送", "待", "炭", "柱", "追", "度", "畑", "発", "美", "秒", "品", "負", "面", "洋", "栄", "軍", "建", "昨", "祝", "省", "信", "浅", "単", "飛", "変", "便", "約", "勇", "要", "城", "香", "茨", "栃", "紀", "型", "逆", "限", "故", "厚", "査", "政", "祖", "則", "独", "保", "迷", "胃", "律", "退", "映", "革", "看", "巻", "皇", "紅", "砂", "姿", "専", "宣", "染", "泉", "洗", "奏", "段", "派", "肺", "背"],
	// 	10: ["校", "家", "夏", "記", "帰", "原", "高", "紙", "時", "弱", "書", "通", "馬", "院", "員", "荷", "起", "宮", "庫", "根", "酒", "消", "真", "息", "速", "庭", "島", "配", "倍", "病", "勉", "旅", "流", "案", "害", "挙", "訓", "郡", "候", "差", "残", "借", "笑", "席", "倉", "孫", "帯", "徒", "特", "梅", "浴", "料", "連", "航", "殺", "粉", "脈", "益", "桜", "格", "個", "耕", "財", "師", "修", "素", "造", "能", "破", "容", "留", "恩", "俵", "株", "胸", "降", "骨", "座", "蚕", "射", "従", "純", "除", "将", "針", "値", "展", "党", "討", "納", "俳", "班", "秘", "陛", "朗"],
	// 	11: ["魚", "教", "強", "黄", "黒", "細", "週", "雪", "船", "組", "鳥", "野", "理", "悪", "球", "祭", "習", "終", "宿", "章", "商", "進", "深", "族", "第", "帳", "笛", "転", "都", "動", "部", "問", "貨", "械", "健", "康", "菜", "産", "唱", "清", "巣", "側", "敗", "票", "副", "望", "陸", "崎", "埼", "鹿", "梨", "救", "停", "堂", "得", "移", "液", "眼", "規", "基", "寄", "許", "経", "険", "現", "混", "採", "授", "術", "常", "情", "責", "設", "接", "断", "張", "貧", "婦", "務", "率", "略", "異", "域", "郷", "済", "視", "捨", "推", "盛", "窓", "探", "著", "頂", "脳", "閉", "訪", "密", "訳", "郵", "翌", "欲"],
	// 	12: ["森", "雲", "絵", "間", "場", "晴", "朝", "答", "道", "買", "番", "飲", "運", "温", "開", "階", "寒", "期", "軽", "湖", "港", "歯", "集", "暑", "勝", "植", "短", "着", "等", "登", "湯", "童", "悲", "筆", "遊", "葉", "陽", "落", "街", "覚", "給", "極", "景", "結", "最", "散", "順", "焼", "隊", "達", "然", "博", "飯", "無", "満", "量", "賀", "富", "滋", "媛", "喜", "象", "貯", "費", "営", "過", "検", "減", "証", "税", "絶", "測", "属", "貸", "程", "提", "統", "備", "評", "復", "報", "貿", "割", "揮", "貴", "筋", "勤", "敬", "裁", "策", "詞", "衆", "就", "善", "装", "創", "尊", "痛", "晩", "補", "棒"],
	// 	13: ["遠", "園", "楽", "新", "数", "電", "話", "暗", "意", "感", "漢", "業", "詩", "想", "鉄", "農", "福", "路", "愛", "塩", "試", "辞", "照", "節", "戦", "続", "置", "働", "群", "解", "幹", "義", "禁", "鉱", "罪", "資", "飼", "準", "勢", "損", "墓", "豊", "夢", "腸", "預", "絹", "源", "署", "傷", "蒸", "誠", "聖", "暖", "賃", "腹", "幕", "盟", "裏"],
	// 	14: ["歌", "語", "算", "読", "聞", "鳴", "駅", "銀", "鼻", "様", "緑", "練", "関", "管", "旗", "察", "種", "静", "説", "漁", "徳", "熊", "歴", "演", "慣", "境", "構", "際", "雑", "酸", "製", "精", "総", "増", "像", "態", "適", "銅", "複", "綿", "領", "銭", "閣", "疑", "誤", "穀", "誌", "磁", "障", "層", "認", "暮", "模"],
	// 	15: ["線", "横", "談", "調", "箱", "億", "課", "器", "選", "熱", "標", "養", "輪", "潟", "縄", "賞", "確", "潔", "賛", "質", "導", "編", "暴", "敵", "遺", "劇", "権", "熟", "諸", "蔵", "誕", "潮", "論"],
	// 	16: ["親", "頭", "館", "橋", "整", "薬", "機", "積", "録", "衛", "興", "築", "燃", "輸", "激", "憲", "鋼", "樹", "縦", "操", "糖", "奮"],
	// 	17: ["講", "謝", "績", "厳", "縮", "優", "覧"],
	// 	18: ["顔", "曜", "題", "観", "験", "類", "額", "職", "織", "簡", "難", "臨"],
	// 	19: ["願", "鏡", "識", "警", "臓"],
	// 	20: ["議", "競", "護"]
	// };
	// const re = [];
	// keysArr.forEach(key => {
	// 	Object.entries(strokeData).forEach(elem => {
	// 		if (elem[1].includes(key)) {
	// 			re.push(elem[0]);
	// 		}
	// 	});
	// });
	// console.log("re: ", re);

	// 学習年で漢字をフィルター
	function filterBy(data, name, value, option) {
		const dontGetKey = option.key === false;
		if (dontGetKey) {
			var newArr = {};
		} else {
			var newArr = [];
		}
		Object.keys(data).forEach(key => {
			if (value.includes(data[key][name])) {
				if (dontGetKey) {
					newArr[key] = data[key];
				} else {
					newArr.push(key);
				}
			}
		});
		return newArr;
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

	function sliceByNumber(array, number) {
		const elements = [...array];
		const length = Math.ceil(elements.length / number);
		return new Array(length).fill().map((_, i) =>
			elements.slice(i * number, (i + 1) * number)
		);
	}

	// 全ての学習年をデータから取得
	var arr = [];
	Object.keys(kanjiData).forEach(key => {
		arr.push(kanjiData[key].studyYear);
	});
	const yearsArr = Array.from(new Set(arr));

	const studyYearsE = document.getElementById("studyYears");
	yearsArr.forEach(year => {
		const elem = `<label><input type="checkbox" name="studyYear" checked value="${year}"><span lang="ja">${year}年生${year === 4 ? "（前期）" : ""}</span><span lang="en-us" hidden>${ordinalSuffix(year)} grade ${year === 4 ? "(first semester)" : ""}</span></label>`;
		studyYearsE.innerHTML += elem;
	});

	const tab01 = document.getElementById("tab01");
	const tabContent = tab01.querySelectorAll(".tabContents .tabWrapper");
	const questionsRows = document.getElementsByClassName("row");
	const studyYearBtns = document.getElementsByName("studyYear");
	const randomCheckElem = document.getElementById("randomCheck");
	const questionCounter = document.getElementById("questionCounter");
	const qCount = document.getElementsByClassName("qCount");
	const sheetsCount = document.getElementsByClassName("sheetsCount");
	const qNumElem = document.getElementById("qNum");
	const kanjiChoicesElems = document.getElementsByName("kanjiChoices");
	const answerBtn = document.getElementById("answer");
	const makeTestBtn = document.getElementById("makeTest");
	const printBtn = document.getElementById("printTest");
	const printAnsBtn = document.getElementById("printAnswer");
	const testAreaElem = document.getElementById("testArea");
	const maxScoreElem = document.getElementById("maxScore");

	// 学習年を選び直した時に、選択肢を変える
	function changeChoices() {
		const checkedYear = getMultiple(studyYearBtns);
		if (tabContent[1].getElementsByTagName("details").length) {
			checkedYear.forEach(year => {
				tabContent[1].querySelector(`#details${year}`).removeAttribute("hidden");
			});
			const otherYears = yearsArr.filter(num => !checkedYear.includes(num));
			otherYears.forEach(year => {
				const elem = tabContent[1].querySelector(`#details${year}`);
				elem.setAttribute("hidden", "");
				elem.querySelectorAll(".kanjiChoicesDiv input").forEach(input => {
					input.checked = false;
				});
			});
		} else {
			// 選択肢を表示
			checkedYear.forEach(year => {
				const choices = filterBy(kanjiData, "studyYear", [year], {key: false});
				const keys = Object.keys(choices);
				if (keys.length) {
					const clone1 = document.getElementById("detailsTemp").content.cloneNode(true);
					const details = clone1.querySelector("details");
					details.setAttribute("id", `details${year}`);
					const h2 = clone1.querySelector("h2");
					h2.setAttribute("id", `kanjiOf${year}`);
					h2.querySelector("[lang=ja]").textContent = `${year}年生${year === 4 ? "（前期）" : ""}`;
					h2.querySelector("[lang=en-us]").textContent = `${ordinalSuffix(year)} grade ${year === 4 ? "(first semester)" : ""}`;
					// 選択肢追加
					const kanjiChoicesTemp = document.getElementById("kanjiChoicesTemp");
					const strokeTitleTemp = document.getElementById("strokeTitleTemp");
					const maxStrokeNum = Math.max(...Object.values(choices).map(e => e.strokesNum));
					let i = 1;
					while (i <= maxStrokeNum) {
						const filteredData = filterBy(choices, "strokesNum", [i], {});
						if (filteredData.length) {
							const clone2 = strokeTitleTemp.content.cloneNode(true);
							clone2.querySelector("[lang=ja]").textContent = `${i}画`;
							clone2.querySelector("[lang=en-us]").textContent = `${i} stroke${i !== 1 ? "s" : ""}`;
							const kanjiChoicesDiv = clone2.querySelector(".kanjiChoicesDiv");
							details.appendChild(clone2);
							filteredData.forEach(choice => {
								const clone3 = kanjiChoicesTemp.content.cloneNode(true);
								const labelElem = clone3.querySelector("label");
								labelElem.children[0].value = choice;
								let html = labelElem.innerHTML;
								html = html.trim();
								html += choice;
								labelElem.innerHTML = html;
								kanjiChoicesDiv.appendChild(clone3);
							});
						}
						i++;
					}
					tabContent[1].appendChild(clone1);
				}
			});
			// 選択肢のイベント
			for (const input of kanjiChoicesElems) {
				input.addEventListener("change", () => {
					if (input.checked) {
						input.parentElement.classList.add("checked");
					} else {
						input.parentElement.classList.remove("checked");
					}
					const num = getMultiple(kanjiChoicesElems).length;
					const sheetsNum = num === 0 ? 0 : Math.ceil(Math.ceil((num - 16) / 8) / 3) + 1;
					const data = {
						questions: {
							elem: qCount,
							data: num,
							replaceText: [
								["questions ", "question "],
								["are", "is"]
							],
						},
						sheets: {
							elem: sheetsCount,
							data: sheetsNum,
							replaceText: [
								["sheets)", "sheet)"]
							],
						}
					};
					for (let i = 0; i < qCount.length; i++) {
						Object.keys(data).forEach(key => {
							const elem = data[key].elem[i];
							const data2 = data[key].data;
							elem.textContent = data2;
							const parent = elem.parentElement;
							if (parent.getAttribute("lang") === "en-us") {
								data[key].replaceText.forEach(arr => {
									parent.innerHTML = parent.innerHTML.replace(arr[data2 === 1 ? 0 : 1], arr[data2 === 1 ? 1 : 0]);
								});
							}
						});
					}
				});
			}
			lang();
		}
		// 「1年生、2年生、3年生の漢字が全て出るテストを作ります。」を変更
		const yearsElem = tabContent[0].getElementsByClassName("years");
		yearsElem[0].textContent = "";
		yearsElem[1].textContent = "";
		checkedYear.forEach(year => {
			yearsElem[0].textContent += `${year}年生${year === 4 ? "（前期）" : ""}`;
			yearsElem[0].textContent += "、";
			yearsElem[1].textContent += `${ordinalSuffix(year)} ${year === 4 ? "(first semester)" : ""}`
			yearsElem[1].textContent += ", ";
		});
		yearsElem[0].textContent = yearsElem[0].textContent.replace(/、$/, "");
		yearsElem[1].textContent = yearsElem[1].textContent.replace(/, $/, "");
		yearsElem[1].textContent = yearsElem[1].textContent.replace(/(.*),/, "$1 and");
	}
	changeChoices();

	// カウンター表示
	const r1 = questionCounter.getBoundingClientRect();
	window.addEventListener("scroll", () => {
		const r2 = makeTestBtn.getBoundingClientRect().top + window.pageYOffset - 600;
		if (r2 < r1.top + window.pageYOffset) {
			questionCounter.setAttribute("hidden", "");
		} else {
			questionCounter.removeAttribute("hidden");
		}
	});

	yearsArr.forEach(year => {
		const elem = document.querySelector(`#details${year} button`);
		elem.addEventListener("click", () => {
			const inputs = elem.parentElement.querySelectorAll("[name=kanjiChoices]");
			const trueOrFalse = !elem.classList.contains("checked");
			for (const input of inputs) {
				input.checked = trueOrFalse;
				input.dispatchEvent(new Event("change"));
			}
			elem.classList.toggle("checked");
			const message = {
				"ja": ["選択", "選択解除"],
				"en-us": ["Select", "Deselect"],
			};
			supportedLang.forEach(lang => {
				if (trueOrFalse) {
					message[lang].reverse();
				}
				elem.innerHTML = elem.innerHTML.replace(message[lang][1], message[lang][0]);
			});
		});
	});

	qNumElem.addEventListener("focus", () => {
		randomCheckElem.removeEventListener("click", ramdomSelect);
	});
	qNumElem.addEventListener("blur", () => {
		randomCheckElem.addEventListener("click", ramdomSelect);
	});
	qNumElem.addEventListener("change", ramdomSelect);

	randomCheckElem.addEventListener("click", ramdomSelect);

	function ramdomSelect() {
		Array.from(kanjiChoicesElems).forEach(input => {
			if (input.checked) {
				input.checked = false;
				input.dispatchEvent(new Event("change"));
			};
		});
		const random = shuffle(Array.from(kanjiChoicesElems)).slice(0, qNumElem.value);
		random.forEach(input => {
			input.checked = true;
			input.dispatchEvent(new Event("change"));
		});
	}

	// テストを作る
	const testH2 = document.getElementById("testH2");
	const questionTemp = document.getElementById("questionTemp");
	function makeTest() {
		// ランダムか漢字の選択か判定
		const hiddenElem = [...tabContent].filter(elem => !elem.classList.contains("activeContent"));
		const kind = hiddenElem[0] === tabContent[1] ? "grade" : "select";
		
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
		testH2.removeAttribute("hidden");
		testAreaElem.removeAttribute("hidden");

		// 今ある問題を削除
		while (questionsRows[0]) {
			questionsRows[0].remove();
		}

		// 漢字を決定
		let qKanji, qNum;
		if (kind === "grade") {
			qKanji = filterBy(kanjiData, "studyYear", studyYear, {});
			qKanji = shuffle(qKanji);
			qNum = qKanji.length;
		} else {
			// 選ばれた漢字を取得
			const kanjis = getMultiple(kanjiChoicesElems);
			// 問題数を取得
			qNum = kanjis.length;
			// シャッフル
			qKanji = shuffle(kanjis);
		}
		maxScoreElem.textContent = qNum;

		const fragment = document.createDocumentFragment();
		qKanji = sliceByNumber(qKanji, 8);
		qKanji.forEach(row => {
			const div = document.createElement("div");
			div.classList.add("row");
			row.forEach(kanji => {
				const test = kanjiData[kanji].test;
				const phraseNum = Math.floor(Math.random() * test.length);	// 何番目のフレーズか
				const clone = questionTemp.content.cloneNode(true);
				const questionElem = clone.querySelector(".question");
				const phraseElem = questionElem.getElementsByClassName("phrase")[0];
				if (test[phraseNum].hasOkurigana) {
					// 送りがながある問題のとき
					questionElem.classList.add("okurigana");
					test[phraseNum].phrase.forEach(phrase => {
						if (phrase.answer) {
							// 読み
							const reading = document.createElement("span");
							reading.classList.add("reading");
							reading.textContent = phrase.reading;
							phraseElem.appendChild(reading);
							// 四角
							const blankElem = document.createElement("div");
							blankElem.classList.add("blank");
							// 答え
							const answerElem = document.createElement("span");
							answerElem.textContent = phrase.answer;
							answerElem.classList.add("answer");
							if (phrase.answer.length >= 4) {
								answerElem.classList.add("long");
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
							if (typeof phrase.answer === "object") {
								// 特別な読み方
								const tokubetsuElem = document.createElement("div");
								tokubetsuElem.classList.add("tokubetsu");
								phraseElem.appendChild(tokubetsuElem);
								// 読み
								const reading = document.createElement("span");
								reading.classList.add("reading");
								reading.textContent = phrase.reading;
								tokubetsuElem.appendChild(reading);
								// 中身
								phrase.answer.forEach(elem => {
									if (elem.answer) {
										// 四角
										const blankElem = document.createElement("div");
										blankElem.classList.add("blank");
										tokubetsuElem.appendChild(blankElem);
										// 答え
										const answerElem = document.createElement("span");
										answerElem.textContent = elem.answer;
										answerElem.classList.add("answer");
										answerElem.setAttribute("hidden", "");
										blankElem.appendChild(answerElem);
									} else {
										tokubetsuElem.innerHTML += elem.text;
									}
								});
							} else {
								// 四角
								const blankElem = document.createElement("div");
								blankElem.classList.add("blank");
								phraseElem.appendChild(blankElem);
								// 答え
								const answerElem = document.createElement("span");
								answerElem.textContent = phrase.answer;
								answerElem.classList.add("answer");
								answerElem.setAttribute("hidden", "");
								blankElem.appendChild(answerElem);
								// 読み
								const reading = document.createElement("span");
								reading.classList.add("reading");
								if (phrase.reading.length >= 3) {
									reading.classList.add("long");
								}
								reading.textContent = phrase.reading;
								blankElem.appendChild(reading);
							}
						} else {
							phraseElem.innerHTML += phrase.text;
						}
					});
				}
				div.appendChild(clone);
			});
			fragment.appendChild(div);
		});
		testAreaElem.appendChild(fragment);

		// テスト内の漢字を学年に合わせる
		const maxYear = Math.max(...studyYear);
		const maxYearElems = document.querySelectorAll(`[data-year="${maxYear}"]`);
		for (let i = 0; i < maxYearElems.length; i++) {
			maxYearElems[i].removeAttribute("hidden");
		}
		const otherYears = yearsArr.filter(num => num !== maxYear);
		for (let i = 0; i < otherYears.length; i++) {
			const otherYearsElems = document.querySelectorAll(`[data-year="${otherYears[i]}"]`);
			for (let y = 0; y < otherYearsElems.length; y++) {
				otherYearsElems[y].setAttribute("hidden", "");
			}
		}
	}

	const kanjiNum = filterBy(kanjiData, "studyYear", yearsArr, {}).length;
	qNumElem.max = kanjiNum;
	// 学習年を選び直したとき
	for (const btn of studyYearBtns) {
		btn.addEventListener("change", () => {
			// 問題数の最大値を漢字の数に合わせる
			const studyYear = getMultiple(studyYearBtns);
			const maxKanjiNum = filterBy(kanjiData, "studyYear", studyYear, {}).length;
			qNumElem.max = maxKanjiNum;
			if (qNumElem.value === "0") {
				qNumElem.value = 40;
			}
			if (Number(qNumElem.value) > Number(qNumElem.max)) {
				qNumElem.value = qNumElem.max;
			}
			// 漢字の選択肢を変更
			changeChoices();
			if (Boolean(getMultiple(kanjiChoicesElems).length)) {
				ramdomSelect();
			}
		});
	}

	// テスト作成
	makeTestBtn.addEventListener("click", () => {
		makeTest();
		if (!testArea.hasAttribute("hidden")) {
			const message = {
				"ja": "テストを更新",
				"en-us": "Update test",
			};
			supportedLang.forEach(lang => {
				makeTestBtn.querySelector(`:lang(${lang})`).textContent = message[lang];
			});
			printBtn.removeAttribute("hidden");
			printAnsBtn.removeAttribute("hidden");
		}
	});

	// 印刷ボタン
	printBtn.addEventListener("click", () => {
		window.onbeforeprint = function() {
			answerBtn.checked = false;
			showAnswer();
		};
		window.print();
	});
	printAnsBtn.addEventListener("click", () => {
		window.onbeforeprint = function() {
			answerBtn.checked = true;
			showAnswer();
		};
		window.onafterprint = function() {
			answerBtn.checked = false;
			showAnswer();
		};
		window.print();
	});

	// 印刷
	window.addEventListener("beforeprint", () => {
		const printArea = document.createElement("div");
		printArea.setAttribute("id", "printArea");
		document.body.appendChild(printArea);
		printArea.appendChild(testAreaElem.cloneNode(true));
		document.body.firstElementChild.setAttribute("hidden", "");
	});
	window.addEventListener("afterprint", () => {
		const elem = document.body.firstElementChild;
		if (elem.hasAttribute("hidden")) {
			elem.removeAttribute("hidden");
			document.getElementById("printArea").remove();
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

}).catch(e => {
	console.error(e.message);
});