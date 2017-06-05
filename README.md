# p6-data-viz
Udacity DAND Project6 Data Visualization

## Summary
This data visualization used various D3.js techniques to represent Titanic 
data. It could be seen as a bar chart that shows the discrenpencies of survival
between different groups:
- Men have a much lower survival rate than women.
- Passengers with higher socio-economic class are more likely survived.

With a deeper look, the bar chart was formed by circles that represent people.

## Design
### Initial Design
Char type: modified bar chart

Visual encoding:
- x axis: survived
- y axis: sex/pclass/etc.
- color: survived (double encoding)

Use one circle for each person, with some animation/interacition

### Design changes after collecting feedback
- adjusted empty space
- added count labels for different "bars"
- changed button color to avoid misunderstanding

## Feedback
1. 
> too many empty space.
> separating the areas of male and female and making them closer will be nice 
> I think 
2. 
> you need to place some numbers otherwise, or the reader will have to count 
> the dots.
3.
> similar colors of buttons and circles lead to misunderstanding
4.
> axis should have meaningful labels

## Resources

https://github.com/d3/d3-3.x-api-reference/blob/master/API-Reference.md

http://bl.ocks.org/d3noob/8952219

http://bl.ocks.org/Caged/6476579