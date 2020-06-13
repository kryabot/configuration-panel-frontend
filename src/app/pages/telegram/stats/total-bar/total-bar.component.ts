import { AfterViewInit, Component, OnDestroy, Input } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { ReportStat } from '../../../../@core/model/ReportStat';
import { DARK_THEME as baseTheme } from '@nebular/theme';

const colors = baseTheme.variables;

@Component({
  selector: 'ngx-stats-total-bar',
  template: `
  <div echarts [options]="options" class="echart"></div>
  `,
})
export class TotalBarComponent implements AfterViewInit, OnDestroy {
  @Input() totalData: ReportStat[] = [];
  @Input() subData: ReportStat[] = []

  options: any = {};
  themeSubscription: any;
  ready: boolean = false

  weekData:number[] = []
  weekSubData:number[] = []
  weekLabels:string[] = []

  monthData:number[] = []
  monthSubData:number[] = []
  monthLabels:string[]= []

  yearData:number[] = []
  yearSubData:number[] = []
  yearLabels:string[] = []

  colors: any;
  echarts: any;


  weekdays:string[] = []

  constructor(private theme: NbThemeService) {

  }

  ngAfterViewInit() {
    this.initTexts()

    console.log('init')
    // console.log(this.totalData)
    // console.log(this.subData)
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

      this.totalData.forEach((row: ReportStat) => {
          let conv = new Date(row.when_dt)

          let sub = this.subData.filter(subRow => subRow.when_dt === row.when_dt);
          let subAmount = 0
          if (sub && sub[0]){
            subAmount = sub[0].counter
          }

          if(conv > fromWeek){
            this.weekData.push(row.counter - subAmount)
            this.weekSubData.push(subAmount)
            this.weekLabels.push(this.weekdays[conv.getDay()])
          }
        
          if(conv > fromMonth){
            this.monthData.push(row.counter - subAmount)
            this.monthSubData.push(subAmount)
            this.monthLabels.push(`${row.when_dt}`)
          }

          if(conv > fromYear){
            this.yearData.push(row.counter - subAmount)
            this.yearSubData.push(subAmount)
            this.yearLabels.push(`${row.when_dt}`)
          }

            
      });

       this.ready = true
  }

  initWeek(){
    this.setOptions(this.weekData, this.weekSubData, this.weekLabels)
  }

  initMonth(){
    this.setOptions(this.monthData, this.monthSubData, this.monthLabels)
  }

  initYear(){
    this.setOptions(this.yearData, this.yearSubData, this.yearLabels)
  }

  setOptions(totalData, subData, labelData){
      console.log(totalData)
      console.log(subData)
    
      this.options = {
        backgroundColor: this.echarts.bg,
        color: [this.colors.warningLight, this.colors.infoLight, this.colors.dangerLight, this.colors.successLight, this.colors.primaryLight],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: this.echarts.tooltipBackgroundColor,
            },
          },
        },
        legend: {
          data: ['Non-subscribers', 'Subscribers'],
          textStyle: {
            color: this.echarts.textColor,
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
            boundaryGap: false,
            data: labelData,
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
            name: 'Subscribers',
            type: 'line',
            stack: 'Total amount',
            areaStyle: { normal: { opacity: this.echarts.areaOpacity } },
            data: subData,
          },
          {
            name: 'Non-subscribers',
            type: 'line',
            stack: 'Total amount',
            // label: {
            //   normal: {
            //     show: true,
            //     position: 'top',
            //     textStyle: {
            //       color: this.echarts.textColor,
            //     },
            //   },
            // },
            areaStyle: { normal: { opacity: this.echarts.areaOpacity } },
            data: totalData,
          },
        ],
      }
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
