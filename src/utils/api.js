import requestAll from './request'

const api = {
    VoteHome(VoteId, userAgent) {
        let data = {
            VoteId,
            userAgent
        };
        return requestAll.Request('Vote/VoteHome',data)
    },
    VoteHomePage(VoteId, Name, Type, PageNumber, Limit){
        let data = {
            VoteId,
            Name,
            Type,
            PageNumber,
            Limit
        };
        return requestAll.Request('Vote/VoteHomePage',data)
    },
    RankList(VoteId, PageNumber, Limit){
        let data = {
            VoteId,
            PageNumber,
            Limit
        };
        return requestAll.Request('Vote/RankList', data)
    },
    ActivityDescription(VoteId){
        let data = {
            VoteId,
        };
        return requestAll.Request('Vote/ActivityDescription', data)
    },
    Image(upfile){
        let data = new FormData();
        data.append('upfile', upfile);
        return requestAll.Request('Vote/Image', data)
    },
    VoteRegister(VoteId, Title, Declaration, Imgs, Field, userAgent){
        let data = {
            VoteId,
            Title,
            Declaration,
            Imgs,
            Field,
            userAgent
        };
        return requestAll.Request('Vote/VoteRegister', data)
    },
    AddVote(VoteOptionId, VoteId, userAgent){
        let data = {
            VoteOptionId,
            VoteId,
            userAgent
        };
        return requestAll.Request('Vote/AddVote', data)
    },
    VoteOptionDetails(VoteOptionId, VoteId){
        let data = {
            VoteOptionId,
            VoteId
        };
        return requestAll.Request('Vote/VoteOptionDetails', data)
    },
    VoteApplyField(VoteId){
        let data = {
            VoteId
        };
        return requestAll.Request('Vote/VoteApplyField', data)
    }
}

export default api