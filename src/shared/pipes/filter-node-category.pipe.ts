import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterNodeCategory',
  pure: true,
})
export class FilterNodeCategoryPipe implements PipeTransform {
  transform(nodes: any[], filterTerm: string): unknown {
    if (filterTerm !== 'ALL') {
      return nodes.filter(
        (nodeData) => nodeData.childNodeCategory == filterTerm
      );
    }
    return nodes;
  }
}
