import {mapGetters, mapMutations, mapActions} from 'vuex'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'

export const playlistMixin = {
	computed: {
	    ...mapGetters([
	      'playlist'
	    ])
	},
	mounted() {
	    this.handlePlaylist(this.playlist)
	},
	activated() {
	    this.handlePlaylist(this.playlist)
	},
	watch: {
	    playlist(newVal) {
	      this.handlePlaylist(newVal)
	    }
	},
	methods: {
	    handlePlaylist() {
	      throw new Error('component must implement handlePlaylist method')
	    }
	}
}


export const playerMixin = {
	computed: {
		iconMode(){
			return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
		},
		favoriteIcon(){
			return this.getFavoriteIcon(this.currentSong)
		},
		...mapGetters([
			'sequenceList',
	        'playlist',
	        'currentSong',
	        'mode',
	        'favoriteList'
		])
	},
	methods: {
		changeMode(){
			const mode = (this.mode + 1) % 3
			this.setPlayMode(mode)
			let list = null
			if(mode === playMode.random){
				list = shuffle(this.sequenceList)
			}else{
				list = this.sequenceList
			}
			this.resetCurrentIndex(list)
			this.setPlayList(list)
		},
		resetCurrentIndex(list){
			let index = list.findIndex((item)=>{
				return item.id === this.currentSong.id
			})
			this.setCurrentIndex(index)
		},
		isFavorite(song){
			const index = this.favoriteList.findIndex((item)=>{
				return item.id === song.id
			})
			return index > -1
		},
		toggleFavorite(song){
			if(this.isFavorite(song)){
				this.deleteFavoriteList(song)
			}else{
				this.saveFavoriteList(song)
			}
		},
		getFavoriteIcon(song){
			if(this.isFavorite(song)){
				return 'icon-favorite'
			}
			return 'icon-not-favorite'
		},
		...mapMutations({
	        setPlayMode: 'SET_PLAY_MODE',
	        setPlayList: 'SET_PLAYLIST',
	        setCurrentIndex: 'SET_CURRENT_INDEX',
	        setPlayingState: 'SET_PLAYING_STATE'
	    }),
	    ...mapActions([
	    	'saveFavoriteList',
      		'deleteFavoriteList'
	    ])
	}

}



export const searchMixin = {
	data(){
		return{
			query: '',
			refreshDelay: 120
		}
	},
	computed: {
		...mapGetters([
		    'searchHistory'
		])
	},
	methods: {
		addQuery(item){
			this.$refs.searchBox.setQuery(item)
		},
			
		onQuertChange(query){
			this.query = query.trim()
		},
		bulrInput(){
			this.$refs.searchBox.bulr()
		},
		saveSearch(){
			this.saveSearchHistory(this.query)
		},
		...mapActions([
		    'saveSearchHistory',
		    'deleteSearchHistory',
		])
	}
}