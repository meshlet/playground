import { Pipe, PipeTransform } from "@angular/core";
import {MODE, ModeTrackerModel} from "./mode-tracker.model";
import {RepositoryModel} from "../model/repository.model";

@Pipe({
  name: "modeFormat"
})
export class ModeFormatPipe implements PipeTransform {
  constructor(private repository: RepositoryModel) {
  }

  transform(value: any): string {
    if (value instanceof ModeTrackerModel) {
      return MODE[value.mode] + (value.id ? ` ${this.repository.getProduct(value.id)?.name || ""}` : "");
    }
    else {
      return "<No data>";
    }
  }
}
