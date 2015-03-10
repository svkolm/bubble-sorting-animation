/**
 * Bubble sorting animation
 *
 * @example Usage:
 <html>
 <head>
    <meta charset="utf-8"/>
    <script src="http://d3js.org/d3.v3.min.js"></script>
 </head>
 <body>
    <script src="bubble-sorting-animation.js"></script>
 </body>
 </html>
 */
(function () { 'use strict';
   var numbers, animate;

   numbers = shuffledNumbers(10);
   animate = bubbleSortAnimator(numbers);
   interruptibleBubbleSort(numbers, animate, 7000)();


   function shuffledNumbers(qty) {
      var numbers = [];

      for (var i = 0; i < qty; i++) {
         numbers.push(i + 1);
      }
      shuffle(numbers);

      return numbers;


      function shuffle(items) {
         var count = items.length,
             index,
             temp;

         while (count > 0) {
            index = Math.floor(Math.random() * count);
            count--;
            temp = items[count];
            items[count] = items[index];
            items[index] = temp;
         }
      }
   }

   function interruptibleBubbleSort(items, interruption, delay) {
      var len = items.length,
          end = len - 1,
          p1 = 0,
          i = 0;

      delay = delay || 700;

      return sort;


      function sort() {
         var p2, swap, temp, timeout;

         if (i === len && p1 === end) {
            return;
         }

         if (p1 < end) {
            p2 = p1 + 1;
            swap = items[p1] > items[p2];

            if (swap) {
               temp = items[p1];
               items[p1] = items[p2];
               items[p2] = temp;
            }

            interruption(p1, items[p1], p2, items[p2], swap, delay);

            p1++;
            timeout = delay;
         }
         else {
            p1 = 0;
            end = len - i - 1;
            i++;
            timeout = 0;
         }

         setTimeout(sort, timeout);
      }
   }

   function bubbleSortAnimator(items) {
      var stage,
          bubbleClass = 'bubble',
          bubbleInterval = items.length * 5,
          bubbleX = bubbleInterval * 3;

      stage = d3
         .select('body')
         .attr('style', 'text-align: center')
         .append('svg')
         .attr('width', bubbleInterval * 5)
         .attr('height', bubbleInterval * (items.length + 3));

      addBubbles(bubbleInterval, 'initial-bubble', '#ccffcc');
      addBubbles(bubbleX, bubbleClass, 'green');

      return animate;


      function bubbleY(pos) {
         return bubbleInterval * (pos + 2);
      }

      function addBubbles(x, cls, color) {
         stage
            .selectAll('.' + cls)
            .data(items)
            .enter()
            .append('circle')
            .attr('class', cls)
            .attr('id', id)
            .style('fill', color)
            .attr('cx', x)
            .attr('cy', y)
            .attr('r', radius);


         function id(d) {
            return cls + d;
         }

         function y(d, i) {
            return bubbleY(i);
         }

         function radius(d) {
            return d * 2;
         }
      }

      function animate(pos1, item1, pos2, item2, swap, delay) {
         var rockDeviation;

         rockDeviation = Math.round(bubbleInterval * 0.7);

         animateBubble(
            bubbleSelector(item1, item2),
            [
               {
                  pos1: pos1,
                  pos2: pos2,
                  sideDeviation: bubbleInterval,
                  rockDeviation: rockDeviation
               }
            ]
         );

         animateBubble(
            bubbleSelector(item2, item1),
            [
               {
                  pos1: pos2,
                  pos2: pos1,
                  sideDeviation: -bubbleInterval,
                  rockDeviation: -rockDeviation
               }
            ]
         );


         function bubbleSelector(item1, item2) {
            return '#' + bubbleClass + (swap ? item2 : item1);
         }

         function animateBubble(selector, data) {
            var bubble, transitions, duration, i, transition;

            bubble = stage
               .select(selector)
               .data(data);

            transitions = transitionSequence();

            duration = Math.round(delay / (transitions.length + 1));

            for (i = 0; i < transitions.length; i++) {
               transition = transitions[i];
               bubble = bubble
                  .transition()
                  .duration(duration)
                  .attr(transition.attr, transition.val);
            }
         }

         function transitionSequence() {
            var transitions;

            transitions = [
               {attr: 'cx', val: x},
               {attr: 'cy', val: yRock},
               {attr: 'cy', val: yRockBack},
               {attr: 'cy', val: yRock},
               {attr: 'cy', val: ySwap},
               {attr: 'cx', val: bubbleX}
            ];

            return transitions;


            function x(d) {
               return bubbleX + d.sideDeviation;
            }

            function y(p1, p2) {
               return swap ? bubbleY(p2) : bubbleY(p1);
            }

            function rock(p1, p2, deviation) {
               return y(p1, p2) + deviation;
            }

            function yRock(d) {
               return rock(d.pos1, d.pos2, d.rockDeviation);
            }

            function yRockBack(d) {
               var absRockDeviation, backDeviation;

               absRockDeviation = Math.abs(d.rockDeviation);
               backDeviation = (bubbleInterval - absRockDeviation) *
                  absRockDeviation / d.rockDeviation;

               return rock(d.pos1, d.pos2, backDeviation);
            }

            function ySwap(d) {
               return y(d.pos1, d.pos2);
            }
         }
      }
   }
}());
