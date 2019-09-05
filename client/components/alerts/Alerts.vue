<template>
    <div v-show="alerts.length > 0">
        <div v-for="alert in alerts">
            <Alert :msg="alert.msg" />
        </div>
    </div>
</template>
<script>
import { mapState } from 'vuex'
import Alert from './Alert'

export default {
    computed: {
        ...mapState(['alerts']),
    },
    components: {
        Alert
    }
}
</script>

