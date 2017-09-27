var rotatorMultiView;
			
			// function startRotator() {
			// 	rotatorMultiView = R.create("rotatormultiview").set({
			// 		container: rotatorMultiViewContainer,
			// 		id: "rotatorMultiView",
			// 		direction: "vertical",
			// 		zIndex: 155,
			// 		spacing: 10,
			// 		textAlign: undefined,
			// 		active: R.create("style").set({className: "multi-active-style",opacity: 1, transform: "scale(1)"}),
			// 		inactive: R.create("style").set({className: "multi-inactive-style",opacity: 0.6, transform: "scale(0.74)"}),
			// 		autoPlay: true,
			// 		clickIndexOffset: 0,
			// 		elements: catImgsArr,
			// 		endOnFirst: true,
			// 		numLoops: 1,
			// 		onDuration: 1,
			// 		transitionDuration: 1,
			// 		ease: "Power0.easeNone"
			// 	}).render();

			// 	nav_next_img.on("click", rotatorMultiView.showNext);
			// 	nav_prev_img.on("click", rotatorMultiView.showPrevious);

			// 	if (rotatorMultiView.elements.length <= 1){
			// 		TweenMax.set([nav_next_img.element, nav_prev_img.element], {autoAlpha: 0});
			// 	}
			// 	rotatorMultiView.controlledBy = [];
			// };

				/*
					STARTING CUSTOM ROTATOR 
					@author Noe Huerta
				*/

				

				var HORIZONTAL = "horizontal",
					VERTICAL = "vertical",
					LEFT = "left",
					RIGHT = "right",
					UP = "up",
					DOWN = "down";

				var clipArray = [],
					isAutoStart = false,
					notClicked = true,
					loopTotal = 1,
					type = VERTICAL,
					direction = UP,
					tweenDelay = R.create("var").set({name:"rotator_change", defaultValue:0.5, dataType:"Number", required:false, exposed:true}).render().value(),
					tweenSpeed = R.create("var").set({name:"rotator_duration", defaultValue:1.25, dataType:"Number", required:false, exposed:true}).render().value(),
					tweenEase = R.create("var").set({name:"rotator_ease", defaultValue:"Sine.easeInOut", dataType:"String", required:false, exposed:true}).render().value(),
					tnSpacing = 4,
					spacing = -10,
					current = 0,
					loopCount = 0,
					// isNext = false,
					// isPrev = false,
					isInteractive = true,
					spacingMinus = -1,
					spacingPlus = 1;


				function startRotator() {

					clipArray = catImgsArr;
					if(clipArray.length > 1){
						arrange();
						autoStart();
					}
				};

				var slideHammer = new Hammer(rotatorMultiViewContainer.element);
				slideHammer.get('pan').set({direction:Hammer.DIRECTION_VERTICAL, threshold:2});

				slideHammer.on('panend', function(ev){
					notClicked = false;
					if(isInteractive){
						if(ev.deltaY < 0){
							direction = UP;
							console.log('is isInteractive up');
							change(-1);
						} else if(ev.deltaY > 1){
							direction = DOWN;
							console.log('is isInteractive down');

							change(1);
						}
				        isInteractive = false;
				        killAutoPlay();
					}
				})

			 	nav_next_img.on('click', function(){
			 		notClicked = false;
			 		if(isInteractive){
				 		direction = DOWN;
				 		change(1);
				 		isInteractive = false;
					    killAutoPlay();
				    }
			 	})

			 	nav_prev_img.on('click', function(){
			 		notClicked = false;
			 		if(isInteractive){
			 		direction = UP;
			 		change(-1);
			 		isInteractive = false;
					    killAutoPlay();
				    }
			 	})

				function arrange(){
					for(var i = 0; i < clipArray.length; i++){
						if(i===1){
							TweenMax.set(clipArray[i].element, {scale: 1});
						} else {
							TweenMax.set(clipArray[i].element, {scale: 0.8});
						}

						if(direction == UP || direction == DOWN){
							TweenMax.set(clipArray[i].element, {y: ((parseInt(clipArray[i].height) + tnSpacing) * i )})
						}else{
							TweenMax.set(clipArray[i].element, {x: ((parseInt(clipArray[i].width) + tnSpacing) * i )})
						}
					}

					if(direction == RIGHT){
						clipArray.unshift(clipArray.pop());
						TweenMax.set(clipArray[0].element, {x: clipArray[1].element._gsTransform.x + (((parseInt(clipArray[1].width) + tnSpacing )) * spacingMinus) })
					}else if (direction == DOWN){
						clipArray.unshift(clipArray.pop());
						TweenMax.set(clipArray[0].element, {y: clipArray[1].element._gsTransform.y + (((parseInt(clipArray[1].height) + tnSpacing )) * spacingMinus) })
					}
				}

				function autoStart(){
					if(isAutoStart){
						current++;
						TweenMax.delayedCall(tweenDelay + tweenSpeed, runAutoPlay);
					}
				}

				function runAutoPlay(){
					for(var i = 0; i < clipArray.length; i++){
						if(i===2){
							TweenMax.to(clipArray[i].element, tweenSpeed, {scale: 1});
						} else {
							TweenMax.to(clipArray[i].element, tweenSpeed, {scale: 0.8});
						}
						switch (type) {
							case VERTICAL :
								if(direction == UP){
									TweenMax.to(clipArray[i].element, tweenSpeed, {y: clipArray[i].element._gsTransform.y + (parseInt(clipArray[i].height) + tnSpacing) * spacingMinus, ease: tweenEase});
								}else{							
									TweenMax.to(clipArray[i].element, tweenSpeed, {y: clipArray[i].element._gsTransform.y + (parseInt(clipArray[i].height) + tnSpacing) * spacingPlus, ease: tweenEase});
								}
								break;
							case HORIZONTAL :
								if(direction == LEFT){
									TweenMax.to(clipArray[i].element, tweenSpeed, {x: clipArray[i].element._gsTransform.x + (parseInt(clipArray[i].width) + tnSpacing) * spacingMinus, ease: tweenEase});
								}else{
									TweenMax.to(clipArray[i].element, tweenSpeed, {x: clipArray[i].element._gsTransform.x + (parseInt(clipArray[i].width) + tnSpacing) * spacingPlus, ease: tweenEase});
								}
								break;
						}
					}
					
					TweenMax.delayedCall(tweenSpeed + .1, switchImage);
					
					if(direction == LEFT || direction == UP){
						clipArray.push(clipArray.shift());
					}else{
						clipArray.unshift(clipArray.pop());
					}
					
					if(current >= clipArray.length){
						loopCount++;
						
						if(loopCount < loopTotal){
							current = 0;
						}
					}
					
					if(current < clipArray.length){
						autoStart();
					}
				}

				function killAutoPlay(){
					if(isAutoStart){
						isInteractive = false;
						isAutoStart = false;
						//TweenMax.killDelayedCallsTo(changeNav);
						current = clipArray.length;
						TweenMax.killDelayedCallsTo(runAutoPlay);
						//TweenMax.delayedCall(1, changeNav);
					}
				}

				function switchImage() {
					switch(type) {
						case VERTICAL :
							if(direction == UP){
								TweenMax.set(clipArray[clipArray.length-1].element, {y: clipArray[clipArray.length-2].element._gsTransform.y + ((parseInt(clipArray[clipArray.length-2].height) + tnSpacing)) });
							}else if(direction == DOWN){
								TweenMax.set(clipArray[0].element, {y: clipArray[1].element._gsTransform.y + (((parseInt(clipArray[1].height) + tnSpacing )) * spacingMinus) });
							}
							break;
						case HORIZONTAL :				
							if(direction == LEFT || direction == UP){
								TweenMax.set(clipArray[clipArray.length-1].element, {x: clipArray[clipArray.length-2].element._gsTransform.x + ((parseInt(clipArray[clipArray.length-2].width) + tnSpacing)) });
							}else if(direction == RIGHT || direction == DOWN){
								TweenMax.set(clipArray[0].element, {x: clipArray[1].element._gsTransform.x + (((parseInt(clipArray[1].width) + tnSpacing )) * spacingMinus) });
							}
							break;
					}		
				}

				function panChange(dir){

				}

				function change(dir){
					isInteractive = false;
					TweenMax.killDelayedCallsTo(switchImage);
					TweenMax.killDelayedCallsTo(changeNav);
					
					switch(type) {
						case VERTICAL :
							if(direction == UP){
								clipArray.push(clipArray.shift());
								console.log('GOING UP');
								TweenMax.set(clipArray[clipArray.length-1].element, {y: clipArray[0].element._gsTransform.y + (((parseInt(clipArray[0].height) + tnSpacing )) * spacingMinus) });
							}else{
								TweenMax.set(clipArray[clipArray.length-1].element, {y: clipArray[0].element._gsTransform.y + (((parseInt(clipArray[0].height) + tnSpacing )) * spacingMinus) })
								clipArray.unshift(clipArray.pop());
							}
							break;
						case HORIZONTAL :
							if(direction == UP){
								clipArray.push(clipArray.shift());
								TweenMax.set(clipArray[clipArray.length-1].element, {x: clipArray[0].element._gsTransform.x + (((parseInt(clipArray[0].width) + tnSpacing )) * spacingPlus) })
							}else{
								TweenMax.set(clipArray[clipArray.length-1].element, {x: clipArray[0].element._gsTransform.x + (((parseInt(clipArray[0].width) + tnSpacing )) * spacingMinus) })
								clipArray.unshift(clipArray.pop());
							}
							break;
					}
					
					for(var i = 0; i < clipArray.length; i++){
						TweenMax.killTweensOf(clipArray[i]);
						if(i===1){
							TweenMax.to(clipArray[i].element, tweenSpeed, {scale: 1});
						} else {
							TweenMax.to(clipArray[i].element, tweenSpeed, {scale: 0.8});
						}
						switch (type) {
							case VERTICAL :
								if(direction == UP){
									TweenMax.to(clipArray[i].element, tweenSpeed, {y: clipArray[i].element._gsTransform.y + (parseInt(clipArray[i].height) + tnSpacing) * spacingMinus, ease: tweenEase});
								}else{							
									TweenMax.to(clipArray[i].element, tweenSpeed, {y: clipArray[i].element._gsTransform.y + (parseInt(clipArray[i].height) + tnSpacing) * spacingPlus, ease: tweenEase});
								}
								break;
							case HORIZONTAL :
								if(direction == UP){
									TweenMax.to(clipArray[i].element, tweenSpeed, {x: clipArray[i].element._gsTransform.x + (parseInt(clipArray[i].width) + tnSpacing) * spacingMinus, ease: tweenEase});
								}else{
									TweenMax.to(clipArray[i].element, tweenSpeed, {x: clipArray[i].element._gsTransform.x + (parseInt(clipArray[i].width) + tnSpacing) * spacingPlus, ease: tweenEase});
								}
								break;
						}
					}
					
					TweenMax.delayedCall(tweenSpeed, switchImage);
					TweenMax.delayedCall(tweenSpeed, changeNav);
			
				}


				function changeNav(){			
					isInteractive = true;
				}

				var autoPlayVar = setInterval(function(){
					if(notClicked && clipArray.length){
						direction = UP;
						change(1);
					}
				 }, 2000);

				(function(){
					setTimeout(function(){
						clearTimeout(autoPlayVar);
					}, 10000)
				}())

				/* END CUSTOM ROTATOR */