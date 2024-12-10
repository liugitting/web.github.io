alpha = 66 + 1 / 60 + 15 / 3600;
R = 700;
L_s = 100;
JD_miles = 14906.807;
JD_X = 144534.846;
JD_Y = 99482.202;
ZH = 273 + 15 / 60 + 23.4 / 3600;
HZ = ZH + alpha - 180;
xishu = 1;
let find_miles, f_x, f_y;

function calculation() {
    clear();

    m = L_s / 2 - L_s ** 3 / (240 * R * R);
    P = L_s ** 2 / (24 * R);
    beta = L_s * 180 / (2 * R * Math.PI);
    document.getElementById("T").innerText = 1;
    document.getElementById("m").innerText = m.toFixed(3);
    document.getElementById("P").innerText = P.toFixed(3);

    var degree0 = parseInt(beta);
    var minute0 = parseInt((beta - parseInt(beta)) * 60);
    var second0 = ((((beta - parseInt(beta)) * 60) - parseInt(((beta - parseInt(beta)) * 60))) * 60).toFixed(1);
    var beta_c = degree0.toString() + "°" + minute0.toString() + "′" + second0.toString() + '"';
    document.getElementById("beta").innerText = beta_c;

    T_H = (R + P) * Math.tan(Math.PI * alpha / 360) + m;
    L_H = Math.PI * R * (alpha - 2 * beta) / 180 + 2 * L_s;
    E_H = (R + P) / Math.cos(Math.PI * alpha / 360) - R;
    q = 2 * T_H - L_H;

    document.getElementById("T").innerText = T_H.toFixed(3);
    document.getElementById("L").innerText = L_H.toFixed(3);
    document.getElementById("E").innerText = E_H.toFixed(3);
    document.getElementById("q").innerText = q.toFixed(3);

    ZH_m = JD_miles - T_H;
    HY_m = ZH_m + L_s;
    QZ_m = ZH_m + L_H / 2;
    YH_m = HY_m + Math.PI * R * (alpha - 2 * beta) / 180;
    HZ_m = YH_m + L_s;

    var l1 = "DK" + parseInt(ZH_m / 1000) + "+ " + (ZH_m - parseInt(ZH_m / 1000) * 1000).toFixed(3);
    var l2 = "DK" + parseInt(HY_m / 1000) + "+ " + (HY_m - parseInt(HY_m / 1000) * 1000).toFixed(3);
    var l3 = "DK" + parseInt(QZ_m / 1000) + "+ " + (QZ_m - parseInt(QZ_m / 1000) * 1000).toFixed(3);
    var l4 = "DK" + parseInt(YH_m / 1000) + "+ " + (YH_m - parseInt(YH_m / 1000) * 1000).toFixed(3);
    var l5 = "DK" + parseInt(HZ_m / 1000) + "+ " + (HZ_m - parseInt(HZ_m / 1000) * 1000).toFixed(3);
    document.getElementById("ZH").innerText = l1;
    document.getElementById("HY").innerText = l2;
    document.getElementById("QZ").innerText = l3;
    document.getElementById("YH").innerText = l4;
    document.getElementById("HZ").innerText = l5;

    //计算坐标
    len = parseInt((HZ_m - ZH_m) / 10);

    let name = Array(len);
    let point_miles = Array(len);
    let point_X = Array(len);
    let point_Y = Array(len);

    //求解局部独立坐标
    for (var i = 0; i < len; i++) {
        point_miles[i] = parseInt(ZH_m / 10) * 10 + 10 * i + 10;
        name[i] = i + 1;
        //第一段ZH_HY
        if (point_miles[i] <= HY_m) {
            var l_i = point_miles[i] - ZH_m;
            point_X[i] = l_i - l_i ** 5 / (20 * R ** 2 * L_s ** 2);
            point_Y[i] = l_i ** 3 / (6 * R * L_s);
        }
        else if (point_miles[i] > HY_m && point_miles[i] <= YH_m) {
            var l_i = point_miles[i] - ZH_m;
            var phi_i = beta + (l_i - L_s) * 180 / R / Math.PI;

            point_X[i] = m + R * Math.sin(phi_i * Math.PI / 180);
            point_Y[i] = P + R * (1 - Math.cos(phi_i * Math.PI / 180));
        }
        else if (point_miles[i] > YH_m && point_miles[i] <= HZ_m) {
            var l_i = HZ_m - point_miles[i];
            point_X[i] = l_i - l_i ** 5 / (20 * R ** 2 * L_s ** 2);
            point_Y[i] = l_i ** 3 / (6 * R * L_s);
        }
    }

    //求解绝对坐标
    ZH_X = JD_X - T_H * Math.cos(ZH * Math.PI / 180);
    ZH_Y = JD_Y - T_H * Math.sin(ZH * Math.PI / 180);
    HZ_X = JD_X - T_H * Math.cos(HZ * Math.PI / 180);
    HZ_Y = JD_Y - T_H * Math.sin(HZ * Math.PI / 180);

    //转换
    for (var i = 0; i < len; i++) {
        //第一段ZH_HY
        if (point_miles[i] <= HY_m) {
            var x = ZH_X + point_X[i] * Math.cos(ZH * Math.PI / 180) - xishu * point_Y[i] * Math.sin(ZH * Math.PI / 180);
            var y = ZH_Y + point_X[i] * Math.sin(ZH * Math.PI / 180) + xishu * point_Y[i] * Math.cos(ZH * Math.PI / 180);
            point_X[i] = x;
            point_Y[i] = y;
        }
        else if (point_miles[i] >= HY_m) {
            var x = HZ_X + point_X[i] * Math.cos(HZ * Math.PI / 180) + xishu * point_Y[i] * Math.sin(HZ * Math.PI / 180);
            var y = HZ_Y + point_X[i] * Math.sin(HZ * Math.PI / 180) - xishu * point_Y[i] * Math.cos(HZ * Math.PI / 180);
            point_X[i] = x;
            point_Y[i] = y;
        }
    }

    //添加表格
    for (var i = 0; i < len; i++) {
        var s = "DK" + parseInt(point_miles[i] / 1000) + "+ " + (point_miles[i] - parseInt(point_miles[i] / 1000) * 1000).toFixed(3);
        // 获取table标签元素
        let table = document.getElementById("point");

        // 创建新行
        let newRow = table.insertRow();
        // 创建三个新单元格
        let cellName = newRow.insertCell();
        let cellmiles = newRow.insertCell();
        let cellX = newRow.insertCell();
        let cellY = newRow.insertCell();
        // 向表格中插入元素
        cellName.innerHTML = name[i];
        cellmiles.innerHTML = s;
        cellX.innerHTML = point_X[i].toFixed(3);
        cellY.innerHTML = point_Y[i].toFixed(3);
    }
    alert("计算完成！");

}

// 打开模态框
function openModal() {

    document.getElementById('modal').style.display = 'block';
    document.getElementById("c_R").value = R;
    document.getElementById("c_L").value = L_s;
    document.getElementById("c_JDm").value = JD_miles;
    document.getElementById("c_JDx").value = JD_X;
    document.getElementById("c_JDy").value = JD_Y;

    document.getElementById("degree").value = parseInt(alpha);
    document.getElementById("minute").value = parseInt((alpha - parseInt(alpha)) * 60);
    document.getElementById("second").value = ((((alpha - parseInt(alpha)) * 60) - parseInt(((alpha - parseInt(alpha)) * 60))) * 60).toFixed(1);

    document.getElementById("degree2").value = parseInt(ZH);
    document.getElementById("minute2").value = parseInt((ZH - parseInt(ZH)) * 60);
    document.getElementById("second2").value = ((((ZH - parseInt(ZH)) * 60) - parseInt(((ZH - parseInt(ZH)) * 60))) * 60).toFixed(1);
    // document.getElementById("c_JDm").value = JD_miles;
    // document.getElementById("c_JDx").value = JD_X;
    if (xishu === 1) {
        document.getElementById("choose2").checked = true;
    }
    else if (xishu === -1) {
        document.getElementById("choose2").checked = false;
    }

}

// 关闭模态框
function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

// 保存更改
function saveChanges() {

    R = document.getElementById("c_R").value;
    document.getElementById("R").innerText = R;
    R = Number(R);

    L_s = document.getElementById("c_L").value;
    document.getElementById("Ls").innerText = L_s;
    L_s = Number(L_s);

    JD_miles = document.getElementById("c_JDm").value;
    document.getElementById("JD_m").innerText = JD_miles;
    JD_miles = Number(JD_miles);

    JD_X = document.getElementById("c_JDx").value;
    document.getElementById("JD_x").innerText = JD_X;
    JD_X = Number(JD_X);

    JD_Y = document.getElementById("c_JDy").value;
    document.getElementById("JD_y").innerText = JD_Y;
    JD_Y = Number(JD_Y);

    var degree = document.getElementById("degree").value;
    var minute = document.getElementById("minute").value;
    var second = document.getElementById("second").value;

    document.getElementById("jiao1").innerText = degree.toString() + "°" + minute.toString() + "′" + second.toString() + '"';
    alpha = Number(degree) + Number(minute) / 60 + Number(second) / 3600;

    var degree2 = document.getElementById("degree2").value;
    var minute2 = document.getElementById("minute2").value;
    var second2 = document.getElementById("second2").value;
    document.getElementById("jiao2").innerText = degree2.toString() + "°" + minute2.toString() + "′" + second2.toString() + '"';
    ZH = Number(degree2) + Number(minute2) / 60 + Number(second2) / 3600;


    var choosenum = document.getElementById("choose2").checked;
    if (choosenum == true) {
        xishu = 1;
        document.getElementById("choose").innerText = "右偏";
    }
    else if (choosenum == false) {
        xishu = -1;
        document.getElementById("choose").innerText = "左偏";
    }

    alert("保存成功");
    clear();
    closeModal(); // 关闭模态框
}

function clear() {
    // 获取表格元素
    let table = document.getElementById("point");

    // 获取表格的总行数
    let rowCount = table.rows.length;

    // 循环遍历从最后一行开始删除
    for (var i = rowCount - 1; i > 0; i--) { // 从最后一行开始，避免影响行数
        table.deleteRow(i);
    }

    document.getElementById("T").innerText = null;
    document.getElementById("m").innerText = null;
    document.getElementById("P").innerText = null;
    document.getElementById("beta").innerText = null;
    document.getElementById("T").innerText = null;
    document.getElementById("L").innerText = null;
    document.getElementById("E").innerText = null;
    document.getElementById("q").innerText = null;
    document.getElementById("ZH").innerText = null;
    document.getElementById("HY").innerText = null;
    document.getElementById("QZ").innerText = null;
    document.getElementById("YH").innerText = null;
    document.getElementById("HZ").innerText = null;

}

function openModal2() {
    document.getElementById('modal2').style.display = 'block';
}

function closeModal2() {
    document.getElementById('modal2').style.display = 'none';
}

function find() {
    find_miles = document.getElementById("find_miles").value;
    find_miles = Number(find_miles);
    if (find_miles < ZH_m || find_miles > HZ_m) {
        alert("里程不在范围内");
    }
    else {
        findsss();
    }
}

function findsss() {
    calculation();

    if (find_miles <= HY_m) {
        var l_i = find_miles - ZH_m;
        f_x = l_i - l_i ** 5 / (20 * R ** 2 * L_s ** 2);
        f_y = l_i ** 3 / (6 * R * L_s);
    }
    else if (find_miles > HY_m && find_miles <= YH_m) {
        var l_i = find_miles - ZH_m;
        var phi_i = beta + (l_i - L_s) * 180 / R / Math.PI;

        f_x = m + R * Math.sin(phi_i * Math.PI / 180);
        f_y = P + R * (1 - Math.cos(phi_i * Math.PI / 180));
    }
    else if (find_miles > YH_m && find_miles <= HZ_m) {
        var l_i = HZ_m - find_miles;
        f_x = l_i - l_i ** 5 / (20 * R ** 2 * L_s ** 2);
        f_y = l_i ** 3 / (6 * R * L_s);
    }

    if (find_miles <= HY_m) {
        var x = ZH_X + f_x * Math.cos(ZH * Math.PI / 180) - xishu * f_y * Math.sin(ZH * Math.PI / 180);
        var y = ZH_Y + f_x * Math.sin(ZH * Math.PI / 180) + xishu * f_y * Math.cos(ZH * Math.PI / 180);
        f_x = x;
        f_y = y;
    }
    else if (find_miles >= HY_m) {
        var x = HZ_X + f_x * Math.cos(HZ * Math.PI / 180) + xishu * f_y * Math.sin(HZ * Math.PI / 180);
        var y = HZ_Y + f_x * Math.sin(HZ * Math.PI / 180) - xishu * f_y * Math.cos(HZ * Math.PI / 180);
        f_x = x;
        f_y = y;
    }

    var s = "DK" + parseInt(find_miles / 1000) + "+ " + (find_miles - parseInt(find_miles / 1000) * 1000).toFixed(3);

    document.getElementById("sf_m").innerText = s;
    document.getElementById("sf_x").innerText = f_x.toFixed(3);
    document.getElementById("sf_y").innerText = f_y.toFixed(3);
}
