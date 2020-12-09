import request from '@/utils/request'

export function getProjects (params = null) {
    return request({
            url: '/v1/mock/projects',
            method: 'get',
            params: params
        }
    )
}

export function getProjectById (projectId) {
    return request({
            url: `/v1/mock/projects/${projectId}`,
            method: 'get'
        }
    )
}

export function addProject (data) {
    return request({
            url: '/v1/mock/projects',
            method: 'post',
            data: data
        }
    )
}

export function updateProject (id, data) {
    return request({
            url: `/v1/mock/projects/${id}`,
            method: 'put',
            data: data
        }
    )
}

export function deleteProject (id) {
    return request({
            url: `/v1/mock/projects/${id}`,
            method: 'delete'
        }
    )
}

export function getMockData (params) {
    return request({
            url: '/v1/mock/data',
            method: 'get',
            params: params
        }
    )
}

export function getFilterMockData (params) {
    return request({
            url: '/v1/mock/data/filter',
            method: 'get',
            params: params
        }
    )
}

export function postMockData (data) {
    return request({
            url: '/v1/mock/data',
            method: 'post',
            data: data
        }
    )
}

export function getMockDataById (id) {
    return request({
            url: `/v1/mock/data/${id}`,
            method: 'get'
        }
    )
}

export function putMockData (data) {
    const { id, ...updatedData } = data
    return request({
            url: `/v1/mock/data/${id}`,
            method: 'put',
            data: updatedData
        }
    )
}

export function deleteMockData (id) {
    return request({
            url: `/v1/mock/data/${id}`,
            method: 'delete'
        }
    )
}

export function batchDeleteMockData (ids) {
    return request({
            url: `/v1/mock/data`,
            method: 'delete',
            data: { ids }
        }
    )
}

export function testMockData (data) {
    return request({
            url: `/v1/mock/test`,
            method: 'post',
            data: data,
        }
    )
}
