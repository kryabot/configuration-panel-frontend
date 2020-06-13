import { AfterViewInit, Component, OnDestroy, Input } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { ReportStat } from '../../../../@core/model/ReportStat';
import { count } from 'rxjs/operators';

@Component({
  selector: 'ngx-stats-message-bar',
  template: `
    <div echarts [options]="options" class="echart"></div>
  `,
})
export class MessageBarComponent implements AfterViewInit, OnDestroy {
  @Input() data: ReportStat[] = [];

  options: any = {};
  themeSubscription: any;
  ready: boolean = false
//   weekData:number[] = [10, 52, 200, 334, 390, 330, 220]
//   weekLabels:string[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  weekData:number[] = []
  weekLabels:string[] = []

  monthData:number[] = []
  monthLabels:string[]= []

  yearData:number[] = []
  yearLabels:string[] = []

  colors: any;
  echarts: any;


  weekdays:string[] = []

  constructor(private theme: NbThemeService) {

  }

  ngAfterViewInit() {
    this.initTexts()

    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
      this.colors = config.variables;
      this.echarts = config.variables.echarts;
      this.initData()
      this.initYear()
    });
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }

  initData(){
      this.weekData = []
      this.weekLabels = []

      this.monthData = []
      this.monthLabels = []

      this.yearData = []
      this.yearLabels = []

      let fromWeek = new Date();
      fromWeek.setDate(fromWeek.getDate() - 9);

      let fromMonth = new Date()
      fromMonth.setDate(fromMonth.getDate() - 32);

      let fromYear = new Date()
      fromYear.setDate(fromMonth.getDate() - 366);

      this.data.forEach((row: ReportStat) => {
          let conv = new Date(row.when_dt)
          if(conv > fromWeek){
            this.weekData.push(row.counter)
            this.weekLabels.push(this.weekdays[conv.getDay()])
          }
        
          if(conv > fromMonth){
            this.monthData.push(row.counter)
            this.monthLabels.push(`${row.when_dt}`)
          }

          if(conv > fromYear){
            this.yearData.push(row.counter)
            this.yearLabels.push(`${row.when_dt}`)
          }

            
      });
       this.ready = true
  }

  initWeek(){
    this.setOptions(this.weekData, this.weekLabels)
  }

  initMonth(){
    this.setOptions(this.monthData, this.monthLabels)
  }

  initYear(){
    this.setOptions(this.yearData, this.yearLabels)
  }

  setOptions(chartData, chartLabels, chartBarWidth='20%'){
    this.options = {
        backgroundColor: this.echarts.bg,
        color: [this.colors.primaryLight],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            data: chartLabels,
            axisTick: {
              alignWithLabel: true,
            },
            axisLine: {
              lineStyle: {
                color: this.echarts.axisLineColor,
              },
            },
            axisLabel: {
              textStyle: {
                color: this.echarts.textColor,
              },
            },
          },
        ],
        yAxis: [
          {
            type: 'value',
            axisLine: {
              lineStyle: {
                color: this.echarts.axisLineColor,
              },
            },
            splitLine: {
              lineStyle: {
                color: this.echarts.splitLineColor,
              },
            },
            axisLabel: {
              textStyle: {
                color: this.echarts.textColor,
              },
            },
          },
        ],
        series: [
          {
            name: 'Messages',
            type: 'bar',
            barWidth: chartBarWidth,
            data: chartData,
          },
        ],
      };
  }

  mapWeekLabl(weekDay: number): string{
    if (weekDay == 0) return
  }

  initTexts(){
    this.weekdays = new Array(7);
    this.weekdays[0] = "Sunday";
    this.weekdays[1] = "Monday";
    this.weekdays[2] = "Tuesday";
    this.weekdays[3] = "Wednesday";
    this.weekdays[4] = "Thursday";
    this.weekdays[5] = "Friday";
    this.weekdays[6] = "Saturday";

    
  }
}
