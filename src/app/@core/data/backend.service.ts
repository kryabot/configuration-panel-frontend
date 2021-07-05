import { Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { Command } from '../model/Command.model';
import { Channel } from '../model/Channel.model';
import { ChannelNotice } from '../model/ChannelNotice';
import { environment } from '../../../environments/environment';
import { TgGroup } from '../model/TgGroup.model';
import { catchError } from 'rxjs/operators';
import { NbAuthService } from '@nebular/auth';
import { AuthGuard } from '../../auth-guard.service';
import { PointReward } from '../model/PointReward';
import { BannedMedia } from '../model/BannedMedia';
import { BannedWord } from '../model/BannedWord';
import { Award } from '../model/Award';
import { ReportStat } from '../model/ReportStat';
import {Permission} from '../model/Permission.model';

@Injectable()
export class BackendService {

    private base_url: string;
    private token: any;
    private targetId: number;
    private defaultJsonHeader = new HttpHeaders().set('Content-Type', 'application/json');

    constructor(private http: HttpClient,
                private authService: NbAuthService,
                private guard: AuthGuard) {
        this.base_url = environment.data_api.base_url + '/auth';
    }

    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.error(
            `Backend returned code ${error.status}, ` +
            `body was: ${error.error}`);
            if (error.status && error.status === 401) {
                this.guard.expiredToken();
            }

            if (error.error && error.error.error && error.error.error.includes('No client id specified')){
                this.guard.expiredToken();
            } else {
                return throwError(error);
            }
        }
        // return an observable with a user-facing error message
        return throwError('Something bad happened; please try again later.');
    };

    searchToken(): string {
        if (!this.token) {
            this.token = JSON.parse(localStorage.getItem('auth_app_token'));
            this.token = JSON.parse(this.token.value);
        }

        if (!this.token) {
            return '';
        }

        return this.token.access_token;
    }

    searchTargetId(): number {
      const val = localStorage.getItem('target_id');
      if (val) {
        this.targetId = parseInt(val);
      }
      return this.targetId || 0;
    }

    protected getHeader(auth?: boolean): HttpHeaders {
        let head = new HttpHeaders();
        head.set('Content-Type', 'application/json');
        head.set('Accept', 'application/json');
        return head;
    }

    protected getUrl(type: string, inputToken?: string, name?: string) {
        if (!inputToken) { inputToken = this.searchToken(); }
        let url = `${this.base_url}/${type}/?access_token=${inputToken}`;

        const target_id = this.searchTargetId();
        if (target_id > 0) {
          url = `${url}&target_id=${target_id}`;
        }
        return url;
    }

    getUserBasic(inputToken?: string): Observable<any> {
        return this.http.get(this.getUrl('user', inputToken), {headers: this.getHeader()}).pipe(catchError(this.handleError.bind(this)));
    }

    getChannel(inputToken?: string, name?: string): Observable<any> {
        return this.http.get(this.getUrl('channel', inputToken), {headers: this.getHeader()}).pipe(catchError(this.handleError.bind(this)));
    }

    getChannels(inputToken?: string, name?: string): Observable<any> {
        return this.http.get(this.getUrl('channel/all', inputToken), {headers: this.getHeader()}).pipe(catchError(this.handleError.bind(this)));
    }

    getCommands(inputToken?: string, name?: string): Observable<any> {
        return this.http.get(this.getUrl('channel/command', inputToken), {headers: this.getHeader()}).pipe(catchError(this.handleError.bind(this)));
    }

    getNotices(inputToken?: string, name?: string): Observable<any> {
        return this.http.get(this.getUrl('channel/notice', inputToken), {headers: this.getHeader()}).pipe(catchError(this.handleError.bind(this)));
    }

    getPointRewards(inputToken?: string, name?: string): Observable<any> {
        return this.http.get(this.getUrl('channel/pointreward', inputToken), {headers: this.getHeader()}).pipe(catchError(this.handleError.bind(this)));
    }

    getTgGroup(inputToken?: string, name?: string): Observable<any> {
        return this.http.get(this.getUrl('telegram/group', inputToken), {headers: this.defaultJsonHeader}).pipe(catchError(this.handleError.bind(this)));
    }

    getTgGroupMembers(inputToken?: string, name?: string): Observable<any> {
        return this.http.get(this.getUrl('telegram/members', inputToken), {headers: this.defaultJsonHeader}).pipe(catchError(this.handleError.bind(this)));
    }

    getTgMemberRights(inputToken?: string, name?: string): Observable<any> {
        return this.http.get(this.getUrl('telegram/rights', inputToken), {headers: this.defaultJsonHeader}).pipe(catchError(this.handleError.bind(this)));
    }

    deleteTgMemberRight(tgId, inputToken?: string, name?: string): Observable<any> {
        return this.http.delete(this.getUrl('telegram/rights/' + tgId, inputToken), {headers: this.defaultJsonHeader}).pipe(catchError(this.handleError.bind(this)));
    }

    saveCommand(command: Command, inputToken?: string) {
        return this.http.post(this.getUrl('channel/command', inputToken), JSON.stringify(command), {headers: this.defaultJsonHeader}).pipe(catchError(this.handleError.bind(this)));
    }

    deleteCommand(command: Command, inputToken?: string) {
        return this.http.delete(this.getUrl('channel/command/' + command.channel_command_id, inputToken), {headers: this.defaultJsonHeader}).pipe(catchError(this.handleError.bind(this)));
    }

    saveChannel(channel: Channel, inputToken?: string) {
        return this.http.post(this.getUrl('channel', inputToken), JSON.stringify(channel), {headers: this.defaultJsonHeader}).pipe(catchError(this.handleError)).pipe(catchError(this.handleError.bind(this)));
    }
    deleteNotice(notice: ChannelNotice, inputToken?: string) {
        return this.http.delete(this.getUrl('channel/notice/' + notice.channel_notice_id , inputToken), {headers: this.defaultJsonHeader}).pipe(catchError(this.handleError.bind(this)));
    }

    deletePointReward(reward: PointReward, inputToken?: string) {
        return this.http.delete(this.getUrl('channel/pointreward/' + reward.channel_point_action_id , inputToken), {headers: this.defaultJsonHeader}).pipe(catchError(this.handleError.bind(this)));
    }

    saveNotice(notice: ChannelNotice, inputToken?: string) {
        return this.http.post(this.getUrl('channel/notice', inputToken), JSON.stringify(notice), {headers: this.defaultJsonHeader}).pipe(catchError(this.handleError.bind(this)));
    }

    savePointReward(reward: PointReward, inputToken?: string) {
        return this.http.post(this.getUrl('channel/pointreward', inputToken), JSON.stringify(reward), {headers: this.defaultJsonHeader}).pipe(catchError(this.handleError.bind(this)));
    }

    saveTgGroup(tggroup: TgGroup, inputToken?: string) {
        return this.http.post(this.getUrl('telegram/group', inputToken), JSON.stringify(tggroup), {headers: this.defaultJsonHeader}).pipe(catchError(this.handleError.bind(this)));
    }

    getBannedMedia(inputToken?: string): Observable<BannedMedia[]>{
        return this.http.get<BannedMedia[]>(this.getUrl('telegram/media', inputToken), {headers: this.getHeader()})
        .pipe(catchError(this.handleError.bind(this)));
    }

    deleteBannedMedia(media: BannedMedia, inputToken?: string) {
        return this.http.delete(this.getUrl(`telegram/media/${media.tg_banned_media_id}`, inputToken), {headers: this.defaultJsonHeader}).pipe(catchError(this.handleError.bind(this)));
    }

    deleteAllBannedMedia(inputToken?: string) {
        return this.http.post(this.getUrl(`telegram/media`, inputToken), {headers: this.defaultJsonHeader}).pipe(catchError(this.handleError.bind(this)));
    }

    getBannedWords(inputToken?: string): Observable<BannedWord[]>{
        return this.http.get<BannedWord[]>(this.getUrl('telegram/word', inputToken), {headers: this.getHeader()})
        .pipe(catchError(this.handleError.bind(this)));
    }

    deleteBannedWord(media: BannedWord, inputToken?: string) {
        return this.http.delete(this.getUrl(`telegram/word/${media.tg_word_id}`, inputToken), {headers: this.defaultJsonHeader}).pipe(catchError(this.handleError.bind(this)));
    }

    deleteAllBannedWords(inputToken?: string) {
        return this.http.post(this.getUrl(`telegram/word`, inputToken), {headers: this.defaultJsonHeader}).pipe(catchError(this.handleError.bind(this)));
    }

    getTgAwards(inputToken?: string): Observable<Award[]>{
        return this.http.get<Award[]>(this.getUrl('telegram/award', inputToken), {headers: this.getHeader()})
        .pipe(catchError(this.handleError.bind(this)));
    }

    deleteTgAward(award: Award, inputToken?: string) {
        return this.http.delete(this.getUrl(`telegram/award/${award.tg_award_id}`, inputToken), {headers: this.defaultJsonHeader}).pipe(catchError(this.handleError.bind(this)));
    }

    deleteAllTgAwards(inputToken?: string) {
        return this.http.post(this.getUrl(`telegram/award`, inputToken), {headers: this.defaultJsonHeader}).pipe(catchError(this.handleError.bind(this)));
    }

    hookMemberRefresh(inputToken?: string, name?: string): Observable<any> {
        return this.http.post(this.getUrl('telegram/members/refresh', inputToken), {headers: this.defaultJsonHeader}).pipe(catchError(this.handleError.bind(this)));
    }

    hookMemberMassKick(settings: any, inputToken?: string, name?: string) {
        return this.http.post(this.getUrl('telegram/members/masskick', inputToken), JSON.stringify(settings), {headers: this.defaultJsonHeader}).pipe(catchError(this.handleError.bind(this)));
    }

    getTgStats(inputToken?: string): Observable<ReportStat[]> {
        return this.http.get<ReportStat[]>(this.getUrl('telegram/stats', inputToken), {headers: this.getHeader()})
        .pipe(catchError(this.handleError.bind(this)));
    }

    getTgLastUserReport(inputToken?: string): Observable<ReportStat[]> {
        return this.http.get<ReportStat[]>(this.getUrl('telegram/stats/lastuserreport', inputToken), {headers: this.getHeader()})
        .pipe(catchError(this.handleError.bind(this)));
    }

    getPermissions(inputToken?: string): Observable<Permission[]> {
      return this.http.get<ReportStat[]>(this.getUrl('channel/permission', inputToken), {headers: this.getHeader()})
        .pipe(catchError(this.handleError.bind(this)));
    }
    deletePermission(type: string, inputToken?: string) {
      return this.http.delete(this.getUrl('channel/permission/' + type, inputToken)).pipe(catchError(this.handleError.bind(this)));
    }
}
