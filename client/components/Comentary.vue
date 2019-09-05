<template>
  <div class="box comentary_box">
    <article class="media">
      <div class="media-left">
        <figure class="image is-64x64">
          <img src="~assets/img/miss.png" alt="Image">
        </figure>
      </div>
      <div class="media-content">
        <div class="content">
          <p>
            <strong>{{ comentary.user_name }}</strong> <small>{{ comentary.stars }}<font-awesome-icon :icon="['fas', 'star']" /></small> <small>{{ comentary.date }}</small>
            <br>
            {{ comentary.commentary }}
          </p>
        </div>
        <!-- <nav class="level is-mobile">
          <div class="level-left">
            <a class="level-item" aria-label="reply">
              <span class="icon is-small">
                <i class="fas fa-reply" aria-hidden="true"></i>
              </span>
            </a>
            <a class="level-item" aria-label="retweet">
              <span class="icon is-small">
                <i class="fas fa-retweet" aria-hidden="true"></i>
              </span>
            </a>
            <a class="level-item" aria-label="like">
              <span class="icon is-small">
                <i class="fas fa-heart" aria-hidden="true"></i>
              </span>
            </a>
          </div>
        </nav> -->
      </div>
    </article>
  </div>
</template>

<script>
export default {
  props: ['comentary']
}
</script>


<style lang="scss" scoped>
 .comentary_box{
    float: left;
    width: 90%;
    margin: 0 5% 15px;
    padding: 7.5px 10px;
  }
  .content{
    p{
      @media (max-width: 368px) {
        font-size: 14px;
      }
    svg{
      margin-left: 10px;
      color: #FBE700;
    }
    }
  }  
</style>
