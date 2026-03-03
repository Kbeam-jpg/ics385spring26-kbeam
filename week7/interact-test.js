import { Interaction } from 'chart.js';
import { getRelativePosition } from 'chart.js/helpers';

/**
 * Custom interaction mode
 * @function Interaction.modes.myCustomMode
 * @param {Chart} chart - the chart we are returning items from
 * @param {Event} e - the event we are to find things at
 * @param {InteractionOptions} options - options to use
 * @param {boolean} [useFinalPosition] - use final element position (animation target)
 * @return {InteractionItem[]} - items that are found
 */

Interaction.modes.myCustomMode = function(chart, e, options, useFinalPosition) {
  const position = getRelativePosition(e, chart);

  const items = [];
  Interaction.evaluateInteractionItems(chart, 'x', position, (element, datasetIndex, index) => {
    if (element.inXRange(position.x, useFinalPosition) && myCustomLogic(element)) {
      items.push({element, datasetIndex, index});
    }
  });
  return items;
};

// Then, to use it...
new Chart.js(ctx, {
    type: 'line',
    data: data,
    options: {
        interaction: {
            mode: 'myCustomMode'
        }
    }
})
 
 