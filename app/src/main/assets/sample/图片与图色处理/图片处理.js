"ui";

var url = "https://www.autojs.org/assets/uploads/files/1540386817060-918021-20160416200702191-185324559.jpg";
var logo = null;

ui.layout(
    <vertical>
        <img id="img" w="250" h="250" url="{{url}}" />
        <button id="grayscale" text="灰度化" />
        <button id="binary" text="二值化" />
        <button id="adaptiveBinary" text="自适应二值化" />
        <button id="hsv" text="RGB转HSV" />
        <button id="blur" text="模糊" />
        <button id="medianBlur" text="中值滤波" />
        <button id="gaussianBlur" text="高斯模糊" />
    </vertical>
);

//把一张图片设置到图片控件中
function setImage(img) {
    ui.run(() => {
        ui.img.setImageBitmap(img.bitmap);
    });
}

//启动一个处理图片的线程
var imgProcess = threads.start(function () {
    setInterval(() => { }, 1000);
});

//处理图片的函数，把任务交给图片处理线程处理
function processImg(process) {
    imgProcess.setTimeout(() => {
        if (logo == null) {
            logo = images.load(url);
        }
        //处理图片
        var result = process(logo);
        //把处理后的图片设置到图片控件中
        setImage(result);
    }, 0);
}

ui.grayscale.on("click", () => {
    processImg(img => {
        //灰度化
        return images.grayscale(img);
    });
});

ui.binary.on("click", () => {
    processImg(img => {
        var g = images.grayscale(img);
        //二值化，取灰度为30到200之间的图片
        var result = images.threshold(g, 100, 200);
        g.recycle();
        return result;
    });
});

ui.adaptiveBinary.on("click", () => {
    processImg(img => {
        var g = images.grayscale(img);
        //自适应二值化，最大值为200，块大小为25
        var result = images.adaptiveThreshold(g, 200, "MEAN_C", "BINARY", 25, 10);
        g.recycle();
        return result;
    });
});

ui.hsv.on("click", () => {
    processImg(img => {
        //RGB转HSV
        return images.cvtColor(img, "BGR2HSV");
    });
});

ui.blur.on("click", () => {
    processImg(img => {
        //模糊
        return images.blur(img, [10, 10]);
    });
});

ui.medianBlur.on("click", () => {
    processImg(img => {
        //中值滤波
        return images.medianBlur(img, 5);
    });
});

ui.gaussianBlur.on("click", () => {
    processImg(img => {
        //高斯模糊
        return images.gaussianBlur(img, [5, 5]);
    });
});