/**
 * Created by gc on 2014/7/10.
 * 
 * 分页组件
 * 
 * 
 */
function getWebPage(options)
{
	var webPage =
		{
			// 总记录数
			total : 0,
			// 总页数数组
			pageTotal : new Array(),
			// 总页数
			pageTotalNum : 0,
			// 当前页
			curPage : 1,
			// 记录数开始
			start : 0,
			// 每页最大记录数
			limit : (options && options.limit) ? options.limit : 5,
			// 分页码开始
			pageMin : 1,
			// 分页码结束
			pageMax : 10,
			// 分页显示个数
			pageNum : (options && options.pageNum) ? options.pageNum : 10,
			// 分页索引
			pageIndex : 0,
			// 初始化方法
			initWebPage : function( opition )
			{
		
				this.total = opition.total;

                this.query = opition.query;
		
				this.pageTotalNum = 0;
				// 计算总页数
				if ( this.total % this.limit == 0 || this.total < this.limit )
					this.pageTotalNum = parseInt( this.total / this.limit ) < 1 ? 1 : parseInt( this.total / this.limit );
				else
					this.pageTotalNum = parseInt( this.total / this.limit ) + 1;
		
				this.curPage = parseInt( this.start ) / parseInt( this.limit ) + 1;
		
				if ( this.curPage > this.pageMax )
				{
					this.pageIndex++;
				}
		
				if ( this.curPage < this.pageMin )
				{
					this.pageIndex--;
				}
		
				this.pageMin = parseInt( this.pageIndex * this.pageNum ) + 1;
				this.pageMax = parseInt( this.pageIndex * this.pageNum ) + this.pageNum;
		
				if ( this.pageMax > this.pageTotalNum )
					this.pageMax = this.pageTotalNum;
		
				this.pageTotal.length = 0;
				for ( var i = this.pageMin; i <= this.pageMax; i++ )
				{
					this.pageTotal.push( i );
				}
			},
			// 下一页
			nextPage : function( page )
			{
		
				if ( parseInt( this.start ) + parseInt( this.limit ) >= parseInt( this.total ) )
					return false;
				if ( page == '...' )
				{
					this.start = ( this.pageMax ) * parseInt( this.limit );
				} else
				{
					this.start = parseInt( this.start ) + parseInt( this.limit );
				}

                if(this.query){
                    this.query();
                }
		
			},
			// 上一页
			lastPage : function( page )
			{
				if ( parseInt( this.start ) - parseInt( this.limit ) < 0 )
					return false;
				if ( page == '...' )
				{
					this.start = ( this.pageMin - 2 ) * parseInt( this.limit );
				} else
				{
					this.start = parseInt( this.start ) - parseInt( this.limit );
				}
                if(this.query){
                    this.query();
                }
			},
			// 当前页
			clickPage : function( page )
			{
				this.start = ( page - 1 ) * parseInt( this.limit );
                if(this.query){
                    this.query();
                }
			},
			deleteOneRow : function(){
			    //计算出最大页数 取当前页数和最大页数的最小值为新的当前页数
			    var maxNum = Math.round((this.total-1)/this.limit);
			    var currentPage = Math.min(maxNum,this.curPage);
			    if(currentPage==0){
			        currentPage = 1;
			    }
			    webPage.start = (currentPage-1)*this.limit;
			},
            changePage : function(limit)
            {
                this.start = 0;
                this.limit = limit;
                if(this.query){
                    this.query();
                }
            }
		};

		return webPage;

}
 
