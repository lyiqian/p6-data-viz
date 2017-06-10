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
**Char type**: modified bar chart. 

This type of chart is able to show the clear 
difference between groups. According to Udacity's Data Visualization course, 
bar chart is even better than pie chart for showing proportions.

**Visual encoding**:

*x axis*: survived

Using a horizontal bar chart since webpages have wider horizontal views than 
vertical. This will ensure each circle is large enough for interaction.

*y axis*: sex/pclass/etc.

After determining the x axis, y axis is naturally for groups.

*color*: survived

Combined with x axis positioning, using color to achieve **double encoding** for
died/survived information. As a result, this key information is emphasized.

*other design choice*:

Use one circle for each person, with some animation/interacition

### Design changes after collecting feedback
- adjusted empty space
- added count labels for different "bars"
- changed button color to avoid misunderstanding
- added comments to the visualization to better communicate findings


### Iterations on design
Link for the first iteration:
http://bl.ocks.org/liu1000/raw/aff013679d9181cca1e901596d0166bc/

Link for the second iteration:
https://github.com/liu1000/p6-data-viz/tree/4668a0e3b8e06dcf3f2f6e0fdd3d47fac721634a

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
5.
> graphic not standlone as an explanatory visualization.

## Resources

https://github.com/d3/d3-3.x-api-reference/blob/master/API-Reference.md

http://bl.ocks.org/d3noob/8952219

http://bl.ocks.org/Caged/6476579