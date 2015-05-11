/**
 * wrapper.js
 * @zzy	 (zyb8523790@163.com)
 * @date    2015-05-11 19:46:20
 * @version 1.001
 */

//RequestAnimationFrame函数兼容性代码
(function() {
	var lastTime = 0;
	var vendors = ['webkit', 'moz'];
	for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
		window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
		window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || // Webkit中此取消方法的名字变了
		window[vendors[x] + 'CancelRequestAnimationFrame'];
	}

	if (!window.requestAnimationFrame) {
		window.requestAnimationFrame = function(callback, element) {
			var currTime = new Date().getTime();
			var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
			var id = window.setTimeout(function() {
				callback(currTime + timeToCall);
			}, timeToCall);
			lastTime = currTime + timeToCall;
			return id;
		};
	}
	if (!window.cancelAnimationFrame) {
		window.cancelAnimationFrame = function(id) {
			clearTimeout(id);
		};
	}
}());

//幻灯片效果
var warpper = {
	//总图片数
	sum: 0,
	//当前激活图片序号
	currentIndex: 0,
	//下个激活的图片序号
	nextIndex: 0,
	//幻灯片容器
	dom: '',
	//幻灯片自动播放速度
	spped: 5000,
	//幻灯片切换动画速度
	animateSpped: 300,
	//当前动画的进度
	_animatePercent: 0,
	//幻灯计时
	_clock: false,
	//初始化，设置当前激活项，添加右下角链接
	init: function(domId) {
		var me = this;
		me.dom = document.getElementById(domId);
		me.sum = me.dom.children.length;
		//添加右下角链接
		var itemLinks = document.createElement('ol');
		for (var i = 1; i <= me.sum; i++) {
			var link = document.createElement("li");
			if (i == 1) {
				link.className += ' ' + 'active';
			}
			link.innerHTML = "<a href='javascript:void(0);' class='wrap-link'>" + i + "</a>";
			itemLinks.appendChild(link);
		}
		me.dom.appendChild(itemLinks);
		//设置当前激活项
		var firstItem = me.dom.children[0];
		if (firstItem.classList) {
			firstItem.classList.add('active');
		} else {
			firstItem.className += ' ' + 'active';
		}
		me.currentIndex = 0;
		//绑定事件
		me._bindEvents();
		//开始切换计时
		me._clock = window.setTimeout(function() {
			me.nextItem();
		}, me.spped);
	},
	//跳至下一个
	nextItem: function() {
		var me = this;
		me.nextIndex = me.currentIndex + 1;
		if (me.nextIndex >= me.sum) {
			me.nextIndex = 0;
		}
		me.inDom = me.dom.querySelectorAll("li")[me.nextIndex];
		me.outDom = me.dom.querySelectorAll("li")[me.currentIndex];
		me.renderAnimation();
	},
	/**
	跳至某一个
	*/
	gotoItem: function(index) {
		var me = this;
		window.clearInterval(me._clock);
		me.nextIndex = index;
		me.inDom = me.dom.querySelectorAll("li")[me.nextIndex];
		me.outDom = me.dom.querySelectorAll("li")[me.currentIndex];
		me.renderAnimation();
	},
	//移出动画
	renderAnimation: function() {
		var me = warpper;
		me._animatePercent += 100 / (me.animateSpped / 16.7);
		if (me._animatePercent > 100) {
			me._animatePercent = 100;
			me._upOut(me.outDom, -me._animatePercent);
			me._upIn(me.inDom, me._animatePercent);
			me._animatePercent = 0;
			//设置图片链接激活状态
			var links = me.dom.parentNode.querySelector("ol"),
				nextLink = links.querySelectorAll("li")[me.nextIndex],
				currentLink = links.querySelectorAll("li")[me.currentIndex];
			if (nextLink.classList) {
				nextLink.classList.add('active');
			} else {
				nextLink.className += ' ' + 'active';
			}
			if (currentLink.classList) {
				currentLink.classList.remove('active');
			} else {
				currentLink.className = currentLink.className.replace(new RegExp('(^|\\b)' + 'active'.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
			}
			me.currentIndex = me.nextIndex;
			//开始新一轮计时
			me._clock = window.setTimeout(function() {
				me.nextItem();
			}, me.spped);
			return;
		}
		me._upOut(me.outDom, -me._animatePercent);
		me._upIn(me.inDom, me._animatePercent);
		requestAnimationFrame(me.renderAnimation);
	},
	//向上移出
	_upOut: function(outDom, percent) {
		outDom.style.top = percent + "%";
	},
	//向上移入
	_upIn: function(inDom, percent) {
		inDom.style.top = (100 - percent) + "%";
	},
	//绑定事件
	_bindEvents: function() {
		var me = this;
		//点击链接跳转图片
		var links = me.dom.parentNode.querySelectorAll(".wrap-link");
		for (var i = 0; i < links.length; i++) {
			links[i].onclick = function(e){
				console.log(e);
				me.gotoItem(e.target.innerHTML-1);
			}
		}
	}
};
warpper.init("mywrapper");