window.addEventListener("load", () => {
	const character = document.getElementById("character").textContent;
	document.title = `「${character}」を含む言葉・熟語`;
	// JSONのロード
	fetch("../kanjidata.json").then(response => {
		if (response.ok) {
			return response.json();
		} else {
			return Promise.reject(new Error("JSONファイルにアクセスできません。"));
		}
	}).then((kanjiData) => {
		const datas = ["studyYear", "bushu", "strokesCount", "onyomi", "kunyomi", "meaning", "examples"];
		datas.forEach(dataName => {
			const element = document.getElementById(dataName);
			const data = kanjiData[character][dataName];
			if (Array.isArray(data)) {
				element.setAttribute("rowspan", data.length)
				data.forEach(yomi => {
					const td = document.createElement("td");
					td.textContent = yomi;
					if (element.nextElementSibling === null) {
						element.parentElement.appendChild(td);
					} else {
						const tr = document.createElement("tr");
						tr.appendChild(td);
						element.parentElement.parentElement.insertBefore(tr, element.parentElement.nextElementSibling);
					}
				});
			} else {
				const td = document.createElement("td");
				if (dataName === "studyYear") {
					td.textContent = data + "年生";
				} else {
					td.textContent = data;
				}
				element.parentElement.appendChild(td);
			}
		});
	}).catch(e => {
		console.error(e.message);
	});
});
